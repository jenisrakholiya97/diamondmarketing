const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../src/data/catalogData.js');

let fileContent = fs.readFileSync(dataFilePath, 'utf8');

function isCadImage(url) {
  if (!url) return false;
  return /\/(0\.50|0\.75|1\.00|2\.00)(_|\.jpg)/.test(url);
}

function isCadVideo(url) {
  if (!url) return false;
  return /(115f59739afd|4a434cd1ed72|b3627cfe656e|99c0b1ca7b6c)/.test(url);
}

const realShapePhotos = {
  'Round Brilliant': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/1.01ct_Round_Lab_Grown_Diamond_Colour_J_Clarity_VS1_Cut_VG_IGI_Certified.webp?v=1775641702',
  'Oval': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/0.50ct_Oval_Lab_Grown_Diamond_Colour_D_Clarity_VS2_IGI_Certified.webp?v=1775023148',
  'Emerald': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/Editing_earring_diamond_photo_2K_202608121431.jpg?v=1789462027',
  'Cushion': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/Photographing_cushion_diamond_202607101427.jpg?v=1787733648',
  'Radiant': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/3.51ct_Radiant_Lab_Grown_Diamond_Colour_D_Clarity_VVS1_IGI_Certified.webp?v=1775181626',
  'Pear': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/Editing_earring_diamond_photo_2K_202608041457.jpg?v=1789188506',
  'Princess': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/Photographing_ring_for_realistic__2K_202609011034_1.jpg?v=1788431115',
  'Marquise': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/Replacing_diamond_in_ring_2K_202608271657_1.jpg?v=1787983793',
  'Heart': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/VWB16104_Y4.jpg?v=1776493657',
  'Asscher': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/Replacing_diamond_in_ring_photo_202608271559.jpg?v=1787978751'
};

const realShapeVideos = {
  'Round Brilliant': 'https://cdn.shopify.com/videos/c/vp/aa9b75e96c01462bb2833009e59fb407/aa9b75e96c01462bb2833009e59fb407.HD-1080p-2.5Mbps-80382398.mp4',
  'Oval': 'https://cdn.shopify.com/videos/c/vp/d05afe56ebf94da49193e1649b4275d5/d05afe56ebf94da49193e1649b4275d5.HD-1080p-2.5Mbps-80097073.mp4',
  'Emerald': 'https://cdn.shopify.com/videos/c/vp/8d6f9edf22bd4566a7987c9bdd6b9bf8/8d6f9edf22bd4566a7987c9bdd6b9bf8.HD-1080p-2.5Mbps-80393333.mp4',
  'Cushion': 'https://cdn.shopify.com/videos/c/vp/9a508c92661e4df4906d6b21b1189b38/9a508c92661e4df4906d6b21b1189b38.HD-1080p-2.5Mbps-80384493.mp4',
  'Radiant': 'https://cdn.shopify.com/videos/c/vp/fc95cb4ccf804fcc8bdd606ed788ceb3/fc95cb4ccf804fcc8bdd606ed788ceb3.HD-1080p-2.5Mbps-80101473.mp4',
  'Pear': 'https://cdn.shopify.com/videos/c/vp/965c61d7d8d140e999dd53d7866e38e7/965c61d7d8d140e999dd53d7866e38e7.HD-1080p-2.5Mbps-80100696.mp4',
  'Princess': 'https://cdn.shopify.com/videos/c/vp/2b66586cc89d42b0bbe57c9b99dc3b20/2b66586cc89d42b0bbe57c9b99dc3b20.HD-1080p-2.5Mbps-80007765.mp4',
  'Marquise': 'https://cdn.shopify.com/videos/c/vp/562266eb747b4a8e8b2f26a2be161d59/562266eb747b4a8e8b2f26a2be161d59.HD-1080p-2.5Mbps-80388931.mp4',
  'Heart': 'https://cdn.shopify.com/videos/c/vp/68939a3fbed1476ea913c06a672ca3f1/68939a3fbed1476ea913c06a672ca3f1.HD-1080p-2.5Mbps-80097387.mp4',
  'Asscher': 'https://cdn.shopify.com/videos/c/vp/adcfb062490d408685fff104343eacc1/adcfb062490d408685fff104343eacc1.HD-1080p-2.5Mbps-80126204.mp4'
};

const jsonStart = fileContent.indexOf('[');
const jsonEnd = fileContent.lastIndexOf('];');
const arrayStr = fileContent.substring(jsonStart, jsonEnd + 1);

const items = JSON.parse(arrayStr);

let modifiedCount = 0;

items.forEach(item => {
  let wasModified = false;

  // Filter out CAD images from item.images
  if (item.images && Array.isArray(item.images)) {
    const originalLen = item.images.length;
    item.images = item.images.filter(img => !isCadImage(img));
    if (item.images.length !== originalLen) wasModified = true;
  }

  // Check item.imageUrl
  if (isCadImage(item.imageUrl)) {
    if (item.images && item.images.length > 0) {
      item.imageUrl = item.images[0];
    } else {
      item.imageUrl = realShapePhotos[item.shape] || realShapePhotos['Round Brilliant'];
      item.images = [item.imageUrl];
    }
    wasModified = true;
  }

  // Check item.videoPoster
  if (isCadImage(item.videoPoster)) {
    item.videoPoster = item.imageUrl;
    wasModified = true;
  }

  // Check item.videoUrl
  if (isCadVideo(item.videoUrl)) {
    item.videoUrl = realShapeVideos[item.shape] || realShapeVideos['Round Brilliant'];
    item.videoPoster = item.imageUrl;
    wasModified = true;
  }

  if (wasModified) modifiedCount++;
});

console.log(`Cleaned ${modifiedCount} items in dataset.`);

const updatedContent = fileContent.substring(0, jsonStart) + JSON.stringify(items, null, 2) + ';\n';
fs.writeFileSync(dataFilePath, updatedContent, 'utf8');
console.log('Successfully updated src/data/catalogData.js');
