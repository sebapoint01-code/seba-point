const fs = require('fs');
const path = 'd:\\SebaPoint\\src\\components\\ServiceDetailPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// Find the start of getTemplateText
const startRegex = /const getTemplateText = \(\) => \{/;
const match = content.match(startRegex);
if (!match) {
  console.log("Could not find getTemplateText");
  process.exit(1);
}

// Find the end of getTemplateText (the next function or return statement)
// Look for `  const handleCopy = () => {`
const endRegex = /const handleCopy = \(\) => \{/;
const endMatch = content.match(endRegex);

if (!endMatch) {
  console.log("Could not find handleCopy");
  process.exit(1);
}

const startIndex = match.index;
const endIndex = endMatch.index;

const newFunction = `const getTemplateText = () => {
    let attachmentsText = '';
    if (businessNature === 'sole') {
      attachmentsText = '১. পাসপোর্ট সাইজ ছবি\\n২. জাতীয় পরিচয়পত্র কপি';
    } else if (businessNature === 'partnership') {
      attachmentsText = '১. সকল অংশীদারের ছবি\\n২. সকল অংশীদারের জাতীয় পরিচয়পত্র কপি\\n৩. অংশীদারি চুক্তিপত্র (নন জুডিশিয়াল স্ট্যাম্প এ)';
    } else {
      attachmentsText = '১. মেমোরেন্ডাম/আর্টিকেল অফ এসোসিয়েশন এর কপি\\n২. ইনকর্পোরেশন সার্টিফিকেট\\n৩. ফর্ম XII';
    }

    const isTradeLicense = service.id === 'new-license' || service.id === 'renewal';
    const isCompanyReg = service.id === 'limited-company';

    let extraTop = '';
    if (isTradeLicense) {
      extraTop = \`কর্পোরেশনের নাম- ঢাকা উত্তর/দক্ষিণ  সিটি কর্পোরেশন\\nসিটি করপোরেশন এর ওয়ার্ড নাম্বারঃ \\nব্যবসার ধরন- \\n\`;
    } else if (isCompanyReg) {
      extraTop = \`শেয়ারহোল্ডারদের নাম ১: \\nশেয়ারহোল্ডারদের নাম ২: \\nশেয়ারহোল্ডারদের নাম ৩: \\nঅনুমোদিত মূলধন (Authorized Capital): \\nপরিশোধিত মূলধন (Paid-up Capital): \\n\`;
    }

    const bizNatureText = businessNature === 'sole' ? 'একক মালিকানা' : businessNature === 'partnership' ? 'অংশীদারি ব্যবসা' : 'লিমিটেড কোম্পানি';

    return \`আবেদনকৃত সেবা: \${service.title}
----------------------------------------

\${extraTop}প্রতিষ্ঠানের নাম: 
\${isCompanyReg ? 'এমডি নাম: ' : 'মালিকের নাম: '}
পিতার নাম: 
মাতার নাম: 
বিজনেস প্রকৃতি: \${bizNatureText}

*স্থায়ী ঠিকানা:*  
হোল্ডিং নং- 
রোড- 
গ্রাম/মহল্লাঃ 
ডাকঘরঃ 
পোস্ট কোডঃ 
থানাঃ 
জেলাঃ 
বিভাগঃ 

*বর্তমান ঠিকানা:* 
হোল্ডিং নং- 
রোড- 
গ্রাম/মহল্লাঃ 
ডাকঘরঃ 
পোস্ট কোডঃ 
থানাঃ 
জেলাঃ 
বিভাগঃ 

বিজনেস ঠিকানা (Business Address): 

জাতীয় পরিচয়পত্র (NID) নম্বর: 
মোবাইল নম্বর: 
ইমেইল: 

প্রয়োজনীয় কাগজপত্র (Required Attachments):
\${attachmentsText}\`;
  };

  `;

const newContent = content.slice(0, startIndex) + newFunction + content.slice(endIndex);

fs.writeFileSync(path, newContent, 'utf8');
console.log('Successfully updated getTemplateText');
