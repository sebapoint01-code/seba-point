import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'local-db.json');

// Helper to read JSON DB
export function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      users: [],
      services: [],
      websettings: [],
      invoices: []
    }, null, 2));
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { users: [], services: [], websettings: [], invoices: [] };
  }
}

// Helper to write JSON DB
export function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function activateLocalFallback() {
  const getCollectionName = (model) => {
    const name = model.modelName.toLowerCase();
    if (name === 'websettings') return 'websettings';
    return name + 's';
  };

  mongoose.Model.insertMany = function(arr) {
    const collectionName = getCollectionName(this);
    const db = readDb();
    if (!db[collectionName]) db[collectionName] = [];
    
    const ModelClass = this;
    const instances = arr.map(item => {
      const plainObj = JSON.parse(JSON.stringify(item));
      if (!plainObj._id) {
        plainObj._id = Math.random().toString(36).substring(2, 9);
      }
      if (!plainObj.createdAt) {
        plainObj.createdAt = new Date().toISOString();
      }
      plainObj.updatedAt = new Date().toISOString();
      db[collectionName].push(plainObj);
      return new ModelClass(plainObj);
    });
    
    writeDb(db);
    return {
      then: function(resolve) {
        return Promise.resolve(resolve(instances));
      }
    };
  };

  mongoose.Model.find = function(query = {}) {
    const collectionName = getCollectionName(this);
    const db = readDb();
    let items = db[collectionName] || [];
    
    if (query && typeof query === 'object') {
      items = items.filter(item => {
        for (const key in query) {
          if (query[key] && typeof query[key] === 'object' && '$ne' in query[key]) {
            if (String(item[key]) === String(query[key].$ne)) return false;
          } else {
            if (String(item[key]) !== String(query[key])) return false;
          }
        }
        return true;
      });
    }
    
    const chain = {
      sort: function(sortObj) {
        const key = Object.keys(sortObj)[0];
        const order = sortObj[key];
        items.sort((a, b) => {
          if (a[key] < b[key]) return order === 1 ? -1 : 1;
          if (a[key] > b[key]) return order === 1 ? 1 : -1;
          return 0;
        });
        return chain;
      },
      then: function(resolve) {
        return Promise.resolve(resolve(items));
      }
    };
    return chain;
  };

  mongoose.Model.findOne = function(query = {}) {
    const collectionName = getCollectionName(this);
    const db = readDb();
    let items = db[collectionName] || [];
    
    const found = items.find(item => {
      for (const key in query) {
        if (query[key] && typeof query[key] === 'object' && '$ne' in query[key]) {
          if (String(item[key]) === String(query[key].$ne)) return false;
        } else {
          if (String(item[key]) !== String(query[key])) return false;
        }
      }
      return true;
    });
    
    const ModelClass = this;
    const instance = found ? new ModelClass(found) : null;
    
    return {
      then: function(resolve) {
        return Promise.resolve(resolve(instance));
      }
    };
  };

  mongoose.Model.findById = function(id) {
    return this.findOne({ _id: id });
  };

  mongoose.Model.countDocuments = function() {
    const collectionName = getCollectionName(this);
    const db = readDb();
    const count = (db[collectionName] || []).length;
    return {
      then: function(resolve) {
        return Promise.resolve(resolve(count));
      }
    };
  };

  mongoose.Model.prototype.save = function() {
    const collectionName = getCollectionName(this.constructor);
    const db = readDb();
    if (!db[collectionName]) db[collectionName] = [];
    
    const plainObj = this.toObject ? this.toObject() : JSON.parse(JSON.stringify(this));
    
    if (!plainObj._id) {
      plainObj._id = Math.random().toString(36).substring(2, 9);
    }
    if (!plainObj.createdAt) {
      plainObj.createdAt = new Date().toISOString();
    }
    plainObj.updatedAt = new Date().toISOString();
    
    const index = db[collectionName].findIndex(item => String(item._id) === String(plainObj._id));
    if (index !== -1) {
      db[collectionName][index] = plainObj;
    } else {
      db[collectionName].push(plainObj);
    }
    
    writeDb(db);
    return Promise.resolve(this);
  };

  mongoose.Model.findOneAndUpdate = function(query, update, options = {}) {
    const collectionName = getCollectionName(this);
    const db = readDb();
    let items = db[collectionName] || [];
    
    const index = items.findIndex(item => {
      for (const key in query) {
        if (String(item[key]) !== String(query[key])) return false;
      }
      return true;
    });
    
    if (index === -1) {
      return {
        then: function(resolve) {
          return Promise.resolve(resolve(null));
        }
      };
    }
    
    const item = items[index];
    const updateFields = update.$set || update;
    const updatedItem = { ...item, ...updateFields, updatedAt: new Date().toISOString() };
    db[collectionName][index] = updatedItem;
    writeDb(db);
    
    const ModelClass = this;
    const instance = new ModelClass(updatedItem);
    return {
      then: function(resolve) {
        return Promise.resolve(resolve(instance));
      }
    };
  };

  mongoose.Model.findByIdAndUpdate = function(id, update, options = {}) {
    return this.findOneAndUpdate({ _id: id }, update, options);
  };

  mongoose.Model.findOneAndDelete = function(query) {
    const collectionName = getCollectionName(this);
    const db = readDb();
    let items = db[collectionName] || [];
    
    const index = items.findIndex(item => {
      for (const key in query) {
        if (String(item[key]) !== String(query[key])) return false;
      }
      return true;
    });
    
    if (index === -1) {
      return {
        then: function(resolve) {
          return Promise.resolve(resolve(null));
        }
      };
    }
    
    const deletedItem = items[index];
    db[collectionName].splice(index, 1);
    writeDb(db);
    
    const ModelClass = this;
    const instance = new ModelClass(deletedItem);
    return {
      then: function(resolve) {
        return Promise.resolve(resolve(instance));
      }
    };
  };

  mongoose.Model.findByIdAndDelete = function(id) {
    return this.findOneAndDelete({ _id: id });
  };
}
