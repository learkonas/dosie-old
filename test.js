
var cover_image_url = "cover_image_url";
const cover_image_url_bank = [
    "https://live.staticflickr.com/5571/14763952742_5405536208_b.jpg",  // 1
    "https://live.staticflickr.com/3853/14751243442_f8b19e649f_b.jpg",  // 2
    "https://live.staticflickr.com/3904/14769858383_5f22e4cfc6_b.jpg",  // 3
    "https://live.staticflickr.com/5716/21117700952_d7733aaecf_b.jpg",  // 4
    "https://live.staticflickr.com/5572/14749675191_df312fd06b_b.jpg",  // 5
    "https://live.staticflickr.com/555/20386702806_85a7ff5470_b.jpg",  // 6
    "https://live.staticflickr.com/5568/14758775716_bb3c66cc97_b.jpg",  // 7
    "https://live.staticflickr.com/3881/14750109452_890b7989a4_b.jpg",  // 8
    "https://live.staticflickr.com/3888/14771092033_32a8e39865_b.jpg",  // 9
    "https://live.staticflickr.com/5643/20391509300_236c42c5c0_z.jpg",  // 10
    "https://live.staticflickr.com/5737/19957209674_360a99dff7_b.jpg",  // 11
    "https://live.staticflickr.com/614/19956900294_332cedbbf4_b.jpg",  // 12
    "https://live.staticflickr.com/5805/19933533444_be3160a125_b.jpg"    //13 
  ]
  
let cover_bank_number = Math.floor(Math.random() * 13);
cover_image_url = cover_image_url_bank[cover_bank_number];
