const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../src/data/catalogData.js');
let fileContent = fs.readFileSync(dataFilePath, 'utf8');

const jsonStart = fileContent.indexOf('[');
const jsonEnd = fileContent.lastIndexOf('];');
const arrayStr = fileContent.substring(jsonStart, jsonEnd + 1);

const items = JSON.parse(arrayStr);

// Clean pure loose diamond photos for each shape
const looseShapePhotos = {
  'Round Brilliant': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/1.01ct_Round_Lab_Grown_Diamond_Colour_J_Clarity_VS1_Cut_VG_IGI_Certified.webp?v=1775641702',
  'Oval': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/0.50ct_Oval_Lab_Grown_Diamond_Colour_D_Clarity_VS2_IGI_Certified.webp?v=1775023148',
  'Radiant': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/3.51ct_Radiant_Lab_Grown_Diamond_Colour_D_Clarity_VVS1_IGI_Certified.webp?v=1775181626',
  'Emerald': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/3.51ct_Radiant_Lab_Grown_Diamond_Colour_D_Clarity_VVS1_IGI_Certified.webp?v=1775181626',
  'Cushion': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/0.50ct_Oval_Lab_Grown_Diamond_Colour_D_Clarity_VS2_IGI_Certified.webp?v=1775023148',
  'Pear': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/0.50ct_Oval_Lab_Grown_Diamond_Colour_D_Clarity_VS2_IGI_Certified.webp?v=1775023148',
  'Princess': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/3.51ct_Radiant_Lab_Grown_Diamond_Colour_D_Clarity_VVS1_IGI_Certified.webp?v=1775181626',
  'Marquise': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/0.50ct_Oval_Lab_Grown_Diamond_Colour_D_Clarity_VS2_IGI_Certified.webp?v=1775023148',
  'Heart': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/1.01ct_Round_Lab_Grown_Diamond_Colour_J_Clarity_VS1_Cut_VG_IGI_Certified.webp?v=1775641702',
  'Asscher': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/3.51ct_Radiant_Lab_Grown_Diamond_Colour_D_Clarity_VVS1_IGI_Certified.webp?v=1775181626',
  'Hexagon': 'https://cdn.shopify.com/s/files/1/0793/4132/2463/files/3.51ct_Radiant_Lab_Grown_Diamond_Colour_D_Clarity_VVS1_IGI_Certified.webp?v=1775181626'
};

const looseShapeVideos = {
  'Round Brilliant': 'https://cdn.shopify.com/videos/c/vp/aa9b75e96c01462bb2833009e59fb407/aa9b75e96c01462bb2833009e59fb407.HD-1080p-2.5Mbps-80382398.mp4',
  'Oval': 'https://cdn.shopify.com/videos/c/vp/d05afe56ebf94da49193e1649b4275d5/d05afe56ebf94da49193e1649b4275d5.HD-1080p-2.5Mbps-80097073.mp4',
  'Emerald': 'https://cdn.shopify.com/videos/c/vp/8d6f9edf22bd4566a7987c9bdd6b9bf8/8d6f9edf22bd4566a7987c9bdd6b9bf8.HD-1080p-2.5Mbps-80393333.mp4',
  'Cushion': 'https://cdn.shopify.com/videos/c/vp/9a508c92661e4df4906d6b21b1189b38/9a508c92661e4df4906d6b21b1189b38.HD-1080p-2.5Mbps-80384493.mp4',
  'Radiant': 'https://cdn.shopify.com/videos/c/vp/fc95cb4ccf804fcc8bdd606ed788ceb3/fc95cb4ccf804fcc8bdd606ed788ceb3.HD-1080p-2.5Mbps-80101473.mp4',
  'Pear': 'https://cdn.shopify.com/videos/c/vp/965c61d7d8d140e999dd53d7866e38e7/965c61d7d8d140e999dd53d7866e38e7.HD-1080p-2.5Mbps-80100696.mp4',
  'Princess': 'https://cdn.shopify.com/videos/c/vp/2b66586cc89d42b0bbe57c9b99dc3b20/2b66586cc89d42b0bbe57c9b99dc3b20.HD-1080p-2.5Mbps-80007765.mp4',
  'Marquise': 'https://cdn.shopify.com/videos/c/vp/562266eb747b4a8e8b2f26a2be161d59/562266eb747b4a8e8b2f26a2be161d59.HD-1080p-2.5Mbps-80388931.mp4',
  'Heart': 'https://cdn.shopify.com/videos/c/vp/68939a3fbed1476ea913c06a672ca3f1/68939a3fbed1476ea913c06a672ca3f1.HD-1080p-2.5Mbps-80097387.mp4',
  'Asscher': 'https://cdn.shopify.com/videos/c/vp/adcfb062490d408685fff104343eacc1/adcfb062490d408685fff104343eacc1.HD-1080p-2.5Mbps-80126204.mp4',
  'Hexagon': 'https://cdn.shopify.com/videos/c/vp/8d6f9edf22bd4566a7987c9bdd6b9bf8/8d6f9edf22bd4566a7987c9bdd6b9bf8.HD-1080p-2.5Mbps-80393333.mp4'
};

let count = 0;

items.forEach(item => {
  if (item.category === 'diamond') {
    const photo = looseShapePhotos[item.shape] || looseShapePhotos['Round Brilliant'];
    const video = looseShapeVideos[item.shape] || looseShapeVideos['Round Brilliant'];

    item.imageUrl = photo;
    item.images = [photo];
    item.videoUrl = video;
    item.videoPoster = photo;
    count++;
  }
});

console.log(`Enforced pure loose diamond media on ${count} loose diamond items.`);

const updatedContent = fileContent.substring(0, jsonStart) + JSON.stringify(items, null, 2) + ';\n';
fs.writeFileSync(dataFilePath, updatedContent, 'utf8');
console.log('Successfully updated src/data/catalogData.js');
