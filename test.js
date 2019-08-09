let axios = require("axios");
axios.defaults.headers.common['x-api-key'] = "5etHSY6yZpiqz1PPuXSZw8LvCdfZ5JivdYROinfuaJYwftWsEHdGZwO2aSts";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.post(`http://api.gigcodes.com/api/get/sale?attribute=19&rank=999`)
.then(function (response) {
  console.log(response.data)
})
.catch(function (error) {
  console.log(error);
});
let async=require('async');


// async function myapp(){
//     let items =[ { title: 'Apple iPhone 8, GSM Unlocked, 256GB - Space Gray (Renewed)',
//     image:'https://m.media-amazon.com/images/I/61UYEl6lfKL._AC_UL320_.jpg',
//     link:'https://www.amazon.com/Apple-iPhone-GSM-Unlocked-256GB/dp/B07753NSQZ/ref=sxin_0_sxwds-bovbs?keywords=iphone&pd_rd_i=B07753NSQZ&pd_rd_r=1ae17e5a-ca03-469c-8ba8-dd3c6b505485&pd_rd_w=8Nggo&pd_rd_wg=15Nci&pf_rd_p=b866bc3b-cfe5-45c1-897c-a8525a3335d9&pf_rd_r=X26V6HYCV43NWJWVE9W4&qid=1565280327&s=gateway',
//     rattings: '4.0 out of 5 stars',
//     description:'\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #4,405 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #72 in Unlocked Cell Phones\n        \n              \n\n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'Amazon Renewed',
//     reviews: '207 customer reviews207 customer reviews' },
//     { title:
//      '\n    \n        \n        \n            iPhone 8\n        \n    \n',
//     image:
//      'https://images-na.ssl-images-amazon.com/images/G/01/appcore/phone/AMZ_FamiyStripe_iPhone_8._CB1564447873_.png',
//     link:
//      'https://www.amazon.com/dp/B076MP43X5/ref_=vn_s_ni2_4?pd_rd_w=FUCMN&pf_rd_p=69b1c247-8dd3-48af-ab77-35c7024f5bd8&pf_rd_r=X26V6HYCV43NWJWVE9W4&pd_rd_r=1ae17e5a-ca03-469c-8ba8-dd3c6b505485&pd_rd_wg=15Nci&qid=1565280327',
//     price: '\n',
//     description: '',
//     category: '',
//     brandName: 'Apple',
//     reviews: '3 customer reviews' },
//     { title:
//      'Apple iPhone 7 - Fully Unlocked (32GB, Black) - Includes 1-Year CPS Warranty (Renewed)',
//     image:
//      'https://m.media-amazon.com/images/I/61uhjfHciaL._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/Apple-iPhone-Unlocked-Warranty-Refurbished/dp/B07Q4LWRZP/ref=sr_1_1?keywords=iphone&qid=1565280327&s=gateway&sr=8-1',
//     price: '$239.99',
//     rattings: '3.6 out of 5 stars',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #87,825 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,569 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'Amazon Renewed',
//     reviews: '9 customer reviews9 customer reviews' },
//     { title:
//      'Apple iPhone 7 Plus, GSM Unlocked, 128GB - Jet Black (Renewed)',
//     image:
//      'https://m.media-amazon.com/images/I/71GEaD9axKL._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/Apple-iPhone-Plus-Unlocked-128GB/dp/B07SNW1ZHZ/ref=sr_1_2?keywords=iphone&qid=1565280327&s=gateway&sr=8-2',
//     price: '$389.99',
//     rattings: '4.0 out of 5 stars',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #57,764 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,114 in Unlocked Cell Phones\n        \n              \n\n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'Amazon Renewed',
//     reviews: '71 customer reviews71 customer reviews' },
//     { title:
//      'Apple iPhone 7, Verizon Unlocked, 32GB - Rose Gold - (Renewed)',
//     image:
//      'https://m.media-amazon.com/images/I/71PI5ouP8iL._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/Apple-iPhone-Verizon-Unlocked-32GB/dp/B07R3C4D67/ref=sr_1_3?keywords=iphone&qid=1565280327&s=gateway&sr=8-3',
//     price: '$234.99',
//     rattings: '3.6 out of 5 stars',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #27,154 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #567 in Unlocked Cell Phones\n        \n              \n\n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'Amazon Renewed',
//     reviews: '30 customer reviews30 customer reviews' },
//     { title: 'Apple iPhone XR, AT&T, 64GB - Red (Renewed)',
//     image:
//      'https://m.media-amazon.com/images/I/51LgEWJZ2CL._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/Apple-iPhone-XR-AT-64GB/dp/B07T1KTPSB/ref=sr_1_4?keywords=iphone&qid=1565280327&s=gateway&sr=8-4',
//     price: '$599.97',
//     rattings: '5.0 out of 5 stars',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #32,115 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #661 in Unlocked Cell Phones\n        \n              \n\n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'Amazon Renewed',
//     reviews: '2 customer reviews2 customer reviews' },
//     { title: 'Apple iPhone 6s AT&T, Rose Gold, 16 GB (Renewed)',
//     image:
//      'https://m.media-amazon.com/images/I/71FVD+JncwL._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/Apple-iPhone-Rose-Gold-Refurbished/dp/B06Y1N4LTR/ref=sr_1_5?keywords=iphone&qid=1565280327&s=gateway&sr=8-5',
//     price: '$127.99',
//     rattings: '4.0 out of 5 stars',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #18,052 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #392 in Unlocked Cell Phones\n        \n              \n\n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'Amazon Renewed',
//     reviews: '1 customer review1 customer review' },
//     { title: 'Apple iPhone 8, Verizon Unlocked, 256GB - Gray - (Renewed)',
//     image:
//      'https://m.media-amazon.com/images/I/51DKcHHYbxL._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/Apple-iPhone-Verizon-Unlocked-256GB/dp/B07R71FSJR/ref=sr_1_6?keywords=iphone&qid=1565280327&s=gateway&sr=8-6',    price: '$398.99',
//     rattings: '2.6 out of 5 stars',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #9,081 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #194 in Unlocked Cell Phones\n        \n              \n\n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'Amazon Renewed',
//     reviews: '5 customer reviews5 customer reviews' },
//     { title:
//      'Apple iPhone Xs Max, Fully Unlocked, 256 GB - Silver (Renewed)',
//     image:
//      'https://m.media-amazon.com/images/I/61eLl+EnYWL._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/Apple-iPhone-Max-Fully-Unlocked/dp/B07TK6SPQK/ref=sr_1_7?keywords=iphone&qid=1565280327&s=gateway&sr=8-7',
//     price: '$1,430.00',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #83,168 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,501 in Unlocked Cell Phones\n        \n              \n\n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'Amazon Renewed',
//     reviews: '' },
//     { title: 'Apple iPhone 8, T-Mobile, 256GB - Gray - (Renewed)',
//     image:
//      'https://m.media-amazon.com/images/I/51DKcHHYbxL._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/Apple-iPhone-T-Mobile-256GB-Renewed/dp/B07RFF3LMF/ref=sr_1_8?keywords=iphone&qid=1565280327&s=gateway&sr=8-8',    price: '$429.97',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #59,190 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,147 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'Amazon Renewed',
//     reviews: '' },
//     { title: 'Apple iPhone 8 Plus, T-Mobile, 64GB - Gray - (Renewed)',
//     image:
//      'https://m.media-amazon.com/images/I/71WbhCNoFrL._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/Apple-iPhone-Plus-T-Mobile-64GB/dp/B07RGCPVHC/ref=sr_1_9?keywords=iphone&qid=1565280327&s=gateway&sr=8-9',
//     price: '$459.97',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #68,612 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,267 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'Amazon Renewed',
//     reviews: '' },
//     { title:
//      'Apple iPhone 7 128GB GSM Unlocked (no CDMA) Smartphone, Black  (Renewed)',
//     image:
//      'https://m.media-amazon.com/images/I/711EbR7y9ZL._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/Apple-iPhone-Unlocked-Smartphone-Renewed/dp/B07TC8NDH5/ref=sr_1_10?keywords=iphone&qid=1565280327&s=gateway&sr=8-10',
//     price: '$289.99',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #652,048 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #8,129 in Unlocked Cell Phones\n        \n              \n        \n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'Amazon Renewed',
//     reviews: '' },
//     { title:
//      'generic Goophone xs max OctaCore Factory Unlocked Cell Phone - International Version (Gold)',
//     image:
//      'https://m.media-amazon.com/images/I/61aiBCXlVaL._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/generic-Goophone-max-OctaCore-Unlocked/dp/B07PV1488Y/ref=sr_1_11?keywords=iphone&qid=1565280327&s=gateway&sr=8-11',
//     price: '$235.00',
//     rattings: '5.0 out of 5 stars',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #268,004 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #3,688 in Unlocked Cell Phones\n        \n              \n        \n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'GooPhone',
//     reviews: '4 customer reviews4 customer reviews' },
//     { title:
//      'Apple iPhone Xs 64GB GSM Unlocked 4G LTE iOS Smartphone - Space Gray - Renewed',
//     image:
//      'https://m.media-amazon.com/images/I/41mr0wA+rBL._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/Apple-iPhone-64GB-Unlocked-Smartphone/dp/B07TCC7SG3/ref=sr_1_12?keywords=iphone&qid=1565280327&s=gateway&sr=8-12',
//     price: '$799.99',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #117,595 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,932 in Unlocked Cell Phones\n        \n              \n        \n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'Amazon Renewed',
//     reviews: '' },
//     { title:
//      'Apple iPhone Xs Max 6.5" Unlocked SIM Free w/Free Case (64GB)',
//     image:
//      'https://m.media-amazon.com/images/I/41-4hi5HplL._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/Apple-iPhone-Unlocked-Free-Case/dp/B07TSYBWD2/ref=sr_1_13?keywords=iphone&qid=1565280327&s=gateway&sr=8-13',
//     price: '$1,329.00',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #653,629 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #8,149 in Unlocked Cell Phones\n        \n              \n        \n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'AAPL Computer',
//     reviews: '' },
//     { title: 'Apple iPhone XR, AT&T, 64GB - Yellow (Renewed)',
//     image:
//      'https://m.media-amazon.com/images/I/61zR-jZSy9L._AC_UY218_.jpg',
//     link:
//      'https://www.amazon.com/Apple-iPhone-XR-AT-64GB/dp/B07SZH6G7C/ref=sr_1_14?keywords=iphone&qid=1565280327&s=gateway&sr=8-14',
//     price: '$599.97',
//     description:
//      '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #172,108 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #2,593 in Unlocked Cell Phones\n        \n              \n        \n    \n    ',
//     category: 'Cell Phones & Accessories',
//     brandName: 'Amazon Renewed',
//     reviews: '' } ];



//     let newItems=[];
//     await Promise.all(items.map(async (element) => {
    
//       }));

//       return newItems
 
     

// }

// let countryDetail = async ()=>{
//     let app=await myapp();
//     console.log(app)
//   }

//   countryDetail()



let newArr=[ { title: 'Apple iPhone XR, AT&T, 64GB - Red (Renewed)',
image:
 'https://m.media-amazon.com/images/I/51LgEWJZ2CL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-XR-AT-64GB/dp/B07T1KTPSB/ref=sr_1_1?keywords=iphone&qid=1565330940&s=gateway&sr=8-1',
price: '$599.97',
rattings: '5.0 out of 5 stars',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #32,994 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #676 in Unlocked Cell Phones\n        \n              \n\n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'Amazon Renewed',
reviews: '2 customer reviews2 customer reviews',
sales: 60 },
{ title: 'Apple iPhone 6s AT&T, Rose Gold, 16 GB (Renewed)',
image:
 'https://m.media-amazon.com/images/I/71FVD+JncwL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-Rose-Gold-Refurbished/dp/B06Y1N4LTR/ref=sr_1_2?keywords=iphone&qid=1565330940&s=gateway&sr=8-2',
price: '$127.99',
rattings: '4.0 out of 5 stars',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #16,830 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #367 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'Amazon Renewed',
reviews: '1 customer review1 customer review',
sales: 120 },
{ title:
 'Apple iPhone 7 Plus, GSM Unlocked, 128GB - Jet Black (Renewed)',
image:
 'https://m.media-amazon.com/images/I/71GEaD9axKL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-Plus-Unlocked-128GB/dp/B07SNW1ZHZ/ref=sr_1_3?keywords=iphone&qid=1565330940&s=gateway&sr=8-3',
price: '$444.04',
rattings: '4.0 out of 5 stars',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #54,595 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,056 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'Amazon Renewed',
reviews: '71 customer reviews71 customer reviews',
sales: 30 },
{ title: 'Apple iPhone 8, Verizon Unlocked, 256GB - Gray - (Renewed)',
image:
 'https://m.media-amazon.com/images/I/51DKcHHYbxL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-Verizon-Unlocked-256GB/dp/B07R71FSJR/ref=sr_1_4?keywords=iphone&qid=1565330940&s=gateway&sr=8-4',
price: '$404.98',
rattings: '2.6 out of 5 stars',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #10,044 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #214 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'Amazon Renewed',
reviews: '5 customer reviews5 customer reviews',
sales: 178 },
{ title:
 'Apple iPhone 7 - Fully Unlocked (128GB, Rose Gold) - (Renewed)',
image:
 'https://m.media-amazon.com/images/I/61ygp1rOCmL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-Unlocked-Warranty-Refurbished/dp/B07Q6VQ147/ref=sr_1_5?keywords=iphone&qid=1565330940&s=gateway&sr=8-5',
price: '$339.99',
rattings: '3.6 out of 5 stars',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #76,850 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,412 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'Amazon Renewed',
reviews: '9 customer reviews9 customer reviews',
sales: 30 },
{ title:
 'Apple iPhone Xs Max, Fully Unlocked, 256 GB - Silver (Renewed)',
image:
 'https://m.media-amazon.com/images/I/61eLl+EnYWL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-Max-Fully-Unlocked/dp/B07TK6SPQK/ref=sr_1_6?keywords=iphone&qid=1565330940&s=gateway&sr=8-6',
price: '$1,430.00',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #120,839 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,944 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'Amazon Renewed',
reviews: '',
sales: 5 },
{ title: 'Apple iPhone 8, T-Mobile, 256GB - Gray - (Renewed)',
image:
 'https://m.media-amazon.com/images/I/51DKcHHYbxL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-T-Mobile-256GB-Renewed/dp/B07RFF3LMF/ref=sr_1_7?keywords=iphone&qid=1565330940&s=gateway&sr=8-7',
price: '$429.97',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #130,444 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #2,054 in Unlocked Cell Phones\n        \n              \n  \n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'Amazon Renewed',
reviews: '',
sales: 5 },
{ title: 'Apple iPhone 8 Plus, T-Mobile, 64GB - Gray - (Renewed)',
image:
 'https://m.media-amazon.com/images/I/71WbhCNoFrL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-Plus-T-Mobile-64GB/dp/B07RGCPVHC/ref=sr_1_8?keywords=iphone&qid=1565330940&s=gateway&sr=8-8',
price: '$459.97',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #114,378 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,867 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'Amazon Renewed',
reviews: '',
sales: 5 },
{ title:
 '\n    \n        \n        \n            Ztotop\n        \n    \n',
image:
 'https://m.media-amazon.com/images/S/abs-image-upload-na/4/AmazonStores/ATVPDKIKX0DER/832228ef0a92b3d4dfa3c7a40898c08e.w400.h400._CR0,0,400,400_.jpg',
link:
 'https://www.amazon.com/stores/page/9A7CB3F7-D140-43C3-BE0C-DF5A36A5A8D7?ingress=1&pd_rd_w=d4o5A&pf_rd_p=fe6c4700-c012-42ab-997e-cbdfefbf3429&pf_rd_r=3KKB5T7KAJDV0SYHMQVR&pd_rd_r=7a24f269-025f-4b85-a17a-188c344acb26&pd_rd_wg=UtLMs&qid=1565330940',
price: '\n',
description: '',
category: '',
brandName: '',
reviews: '' },
{ title:
 'Apple iPhone 7 128GB GSM Unlocked (no CDMA) Smartphone, Black  (Renewed)',
image:
 'https://m.media-amazon.com/images/I/711EbR7y9ZL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-Unlocked-Smartphone-Renewed/dp/B07TC8NDH5/ref=sr_1_9?keywords=iphone&qid=1565330940&s=gateway&sr=8-9',
price: '$269.99',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #667,703 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #8,293 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'Amazon Renewed',
reviews: '',
sales: '< 5' },
{ title: 'Apple iPhone Xs Max, AT&T, 64GB - Gray - (Renewed)',
image:
 'https://m.media-amazon.com/images/I/81nSsCFeiTL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-Xs-Max-64GB/dp/B07RKYQSRB/ref=sr_1_10?keywords=iphone&qid=1565330940&s=gateway&sr=8-10',
price: '$879.97',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #121,542 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,953 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'Amazon Renewed',
reviews: '',
sales: 5 },
{ title:
 'generic Goophone xs max OctaCore Factory Unlocked Cell Phone - International Version (Gold)',
image:
 'https://m.media-amazon.com/images/I/61aiBCXlVaL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/generic-Goophone-max-OctaCore-Unlocked/dp/B07PV1488Y/ref=sr_1_11?keywords=iphone&qid=1565330940&s=gateway&sr=8-11',
price: '$235.00',
rattings: '5.0 out of 5 stars',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #297,632 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #4,056 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'GooPhone',
reviews: '4 customer reviews4 customer reviews',
sales: '< 5' },
{ title:
 'Apple iPhone Xs 64GB GSM Unlocked 4G LTE iOS Smartphone - Space Gray - Renewed',
image:
 'https://m.media-amazon.com/images/I/41mr0wA+rBL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-64GB-Unlocked-Smartphone/dp/B07TCC7SG3/ref=sr_1_12?keywords=iphone&qid=1565330940&s=gateway&sr=8-12',
price: '$796.97',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #65,337 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,252 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'Amazon Renewed',
reviews: '',
sales: 30 },
{ title:
 'Apple iPhone Xs Max 6.5" Unlocked SIM Free w/Free Case (64GB)',
image:
 'https://m.media-amazon.com/images/I/41-4hi5HplL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-Unlocked-Free-Case/dp/B07TSYBWD2/ref=sr_1_13?keywords=iphone&qid=1565330940&s=gateway&sr=8-13',
price: '$1,329.00',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #673,134 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #8,344 in Unlocked Cell Phones\n        \n              \n\n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'AAPL Computer',
reviews: '',
sales: '< 5' },
{ title: 'Apple iPhone XR, AT&T, 64GB - Yellow (Renewed)',
image:
 'https://m.media-amazon.com/images/I/61zR-jZSy9L._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-XR-AT-64GB/dp/B07SZH6G7C/ref=sr_1_14?keywords=iphone&qid=1565330940&s=gateway&sr=8-14',
price: '$599.97',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #87,485 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,543 in Unlocked Cell Phones\n        \n              \n \n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'Amazon Renewed',
reviews: '',
sales: 30 },
{ title: 'Apple iPhone XR, AT&T, 256GB - Black (Renewed)',
image:
 'https://m.media-amazon.com/images/I/51wzC34azRL._AC_UL436_SEARCH212385_.jpg',
link:
 'https://www.amazon.com/Apple-iPhone-XR-AT-256GB/dp/B07T2MW8BP/ref=sr_1_15?keywords=iphone&qid=1565330940&s=gateway&sr=8-15',
price: '$744.97',
description:
 '\n    \n        Best Sellers Rank\n    \n    \n         \n              \n                #462,614 in Cell Phones & Accessories (See Top 100 in Cell Phones & Accessories)\n        \n              \n                #1,372 in Carrier Cell Phones\n        \n              \n\n    \n    ',
category: 'Cell Phones & Accessories',
brandName: 'Amazon Renewed',
reviews: '',
sales: '< 5' } ]
let totalSale=0;

newArr.forEach((element)=>{
  if(element.sales != undefined && element.sales != ""){
    if(element.sales == '< 5' ){
      element.sales=5;
    }
    totalSale+=element.sales;
    // let sale =element.sales.match(/\d+/g)[0]

   }
})
console.log(totalSale)
