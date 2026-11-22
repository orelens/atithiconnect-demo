export type Lang = "en" | "hi";
export type TicketStatus = "pending" | "accepted" | "progress" | "done";
export type OrderStatus = "new" | "preparing" | "ready" | "served" | "cancelled";
export type Veg = "veg" | "nonveg";

export type Ticket = {
  id: string;
  room: string;
  title: string;
  titleHi: string;
  guest: string;
  agoMin: number;
  department: "housekeeping" | "reception" | "maintenance";
  detail: string;
  detailHi: string;
  status: TicketStatus;
};

export type OrderItem = { name: string; nameHi: string; qty: number; veg?: Veg };
export type Order = {
  id: number;
  room: string;
  guest: string;
  agoMin: number;
  status: OrderStatus;
  items: OrderItem[];
  note?: string;
  noteHi?: string;
};

export type Dish = {
  id: string;
  name: string;
  nameHi: string;
  desc: string;
  descHi: string;
  price: number;
  veg: Veg;
  category: "breakfast" | "starters" | "mains" | "breads" | "drinks" | "sweets";
  often?: boolean;
  image: string;
};

export const HOTEL = "Hotel Demo Indore";
export const WIFI = { network: "Atithi_Guest", password: "Indore@2026" };
export const GUEST = { name: "Priya Sharma", formal: "Ms. Sharma", formalHi: "सुश्री शर्मा", room: "101", checkout: "24 Nov · 11:00 am", checkoutHi: "24 नव · सुबह 11:00" };
export const STAFF = {
  reception: "Meera Nair",
  kitchen: "Imran Qureshi",
  housekeeping: "Ramesh Patel",
  owner: "Arjun Malhotra",
};

export const initialTickets: Ticket[] = [
  { id: "t102", room: "102", title: "Extra towels", titleHi: "अतिरिक्त तौलिये", guest: "Rahul Mehta", agoMin: 44, department: "housekeeping", detail: "Two bath towels", detailHi: "दो बाथ तौलिये", status: "pending" },
  { id: "t203", room: "203", title: "Repair", titleHi: "मरम्मत", guest: "Vikram Singh", agoMin: 60, department: "reception", detail: "AC is not cooling", detailHi: "एसी ठंडक नहीं दे रहा", status: "accepted" },
  { id: "t104", room: "104", title: "Room cleaning", titleHi: "कमरे की सफाई", guest: "Ananya Joshi", agoMin: 60, department: "housekeeping", detail: "After lunch is fine", detailHi: "दोपहर के खाने के बाद ठीक है", status: "progress" },
  { id: "t101", room: "101", title: "Drinking water", titleHi: "पीने का पानी", guest: "Priya Sharma", agoMin: 240, department: "housekeeping", detail: "Two bottles", detailHi: "दो बोतलें", status: "done" },
  { id: "t207", room: "207", title: "Luggage help", titleHi: "सामान में मदद", guest: "Fatima Qureshi", agoMin: 360, department: "reception", detail: "Two bags to the car", detailHi: "दो बैग गाड़ी तक", status: "done" },
];

export const initialOrders: Order[] = [
  { id: 1050, room: "206", guest: "Kabir Kapoor", agoMin: 43, status: "new", items: [
    { name: "Chicken biryani", nameHi: "चिकन बिरयानी", qty: 2, veg: "nonveg" },
    { name: "Gulab jamun", nameHi: "गुलाब जामुन", qty: 1, veg: "veg" },
  ]},
  { id: 1049, room: "101", guest: "Priya Sharma", agoMin: 58, status: "preparing", note: "Less spicy, please.", noteHi: "कम तीखा रखिए, कृपया।", items: [
    { name: "Paneer butter masala", nameHi: "पनीर बटर मसाला", qty: 1, veg: "veg" },
    { name: "Butter naan", nameHi: "बटर नान", qty: 2, veg: "veg" },
    { name: "Masala chai", nameHi: "मसाला चाय", qty: 1, veg: "veg" },
  ]},
  { id: 1048, room: "207", guest: "Fatima Qureshi", agoMin: 51, status: "ready", note: "Extra coconut chutney.", noteHi: "अतिरिक्त नारियल चटनी।", items: [
    { name: "Masala dosa", nameHi: "मसाला डोसा", qty: 1, veg: "veg" },
    { name: "Filter coffee", nameHi: "फिल्टर कॉफ़ी", qty: 1, veg: "veg" },
  ]},
];

export const dishes: Dish[] = [
  { id: "dosa", name: "Masala dosa", nameHi: "मसाला डोसा", desc: "Crisp dosa, potato masala, coconut chutney.", descHi: "कुरकुरा डोसा, आलू मसाला, नारियल चटनी।", price: 140, veg: "veg", category: "breakfast", often: true, image: `${import.meta.env.BASE_URL}images/dosa.jpg` },
  { id: "poha", name: "Poha", nameHi: "पोहा", desc: "Indore-style flattened rice, sev, and lime.", descHi: "इंदौर शैली का पोहा, सेव और नींबू।", price: 80, veg: "veg", category: "breakfast", often: true, image: `${import.meta.env.BASE_URL}images/poha.jpg` },
  { id: "paratha", name: "Aloo paratha", nameHi: "आलू पराठा", desc: "Two parathas with curd and pickle.", descHi: "दही और अचार के साथ दो पराठे।", price: 120, veg: "veg", category: "breakfast", often: false, image: `${import.meta.env.BASE_URL}images/paratha-thumb.jpg` },
  { id: "tikka", name: "Chicken tikka", nameHi: "चिकन टिक्का", desc: "Charred tandoor chicken, minted yoghurt.", descHi: "तंदूरी चिकन, पुदीने वाला दही।", price: 290, veg: "nonveg", category: "starters", often: true, image: `${import.meta.env.BASE_URL}images/chicken-tikka.jpg` },
  { id: "paneer", name: "Paneer butter masala", nameHi: "पनीर बटर मसाला", desc: "Soft paneer in a tomato-cashew gravy.", descHi: "टमाटर-काजू ग्रेवी में नरम पनीर।", price: 260, veg: "veg", category: "mains", image: `${import.meta.env.BASE_URL}images/paneer.jpg` },
  { id: "biryani", name: "Chicken biryani", nameHi: "चिकन बिरयानी", desc: "Slow-cooked dum biryani, raita on the side.", descHi: "दम बिरयानी, साथ में रायता।", price: 320, veg: "nonveg", category: "mains", image: `${import.meta.env.BASE_URL}images/biryani.jpg` },
  { id: "naan", name: "Butter naan", nameHi: "बटर नान", desc: "Tandoor naan finished with white butter.", descHi: "सफ़ेद मक्खन के साथ तंदूरी नान।", price: 50, veg: "veg", category: "breads", image: `${import.meta.env.BASE_URL}images/naan.jpg` },
  { id: "chai", name: "Masala chai", nameHi: "मसाला चाय", desc: "Cardamom and ginger, served hot.", descHi: "इलायची और अदरक, गरम।", price: 40, veg: "veg", category: "drinks", image: `${import.meta.env.BASE_URL}images/chai.jpg` },
  { id: "coffee", name: "Filter coffee", nameHi: "फिल्टर कॉफ़ी", desc: "South Indian decoction with frothed milk.", descHi: "दक्षिणी डिकोक्शन और फेन वाला दूध।", price: 60, veg: "veg", category: "drinks", image: `${import.meta.env.BASE_URL}images/coffee.jpg` },
  { id: "gulab", name: "Gulab jamun", nameHi: "गुलाब जामुन", desc: "Warm milk dumplings in rose syrup.", descHi: "गुलाब की चाशनी में गरम जामुन।", price: 90, veg: "veg", category: "sweets", image: `${import.meta.env.BASE_URL}images/gulab.jpg` },
];

export const rooms = [
  { room: "101", guest: "Priya Sharma", status: "occupied", checkout: "24 Nov, 11:00 am" },
  { room: "102", guest: "Rahul Mehta", status: "occupied", checkout: "23 Nov, 12:00 pm" },
  { room: "104", guest: "Ananya Joshi", status: "cleaning", checkout: "23 Nov, 10:00 am" },
  { room: "105", guest: "Sanjay Rao", status: "occupied", checkout: "25 Nov, 11:00 am" },
  { room: "108", guest: "Neha Kulkarni", status: "occupied", checkout: "24 Nov, 12:00 pm" },
  { room: "203", guest: "Vikram Singh", status: "occupied", checkout: "23 Nov, 11:00 am" },
  { room: "206", guest: "Kabir Kapoor", status: "occupied", checkout: "24 Nov, 10:00 am" },
  { room: "207", guest: "Fatima Qureshi", status: "occupied", checkout: "23 Nov, 11:00 am" },
  { room: "201", guest: "", status: "ready", checkout: "" },
  { room: "202", guest: "", status: "ready", checkout: "" },
  { room: "204", guest: "", status: "ready", checkout: "" },
  { room: "205", guest: "", status: "ready", checkout: "" },
  { room: "208", guest: "", status: "ready", checkout: "" },
  { room: "301", guest: "", status: "ready", checkout: "" },
  { room: "302", guest: "", status: "ready", checkout: "" },
  { room: "303", guest: "", status: "ready", checkout: "" },
  { room: "304", guest: "", status: "ready", checkout: "" },
  { room: "305", guest: "", status: "cleaning", checkout: "" },
  { room: "306", guest: "", status: "ready", checkout: "" },
  { room: "307", guest: "", status: "ready", checkout: "" },
];

export const feedback = [
  { who: "Neha Kulkarni", room: "108", score: 4, text: "Loved being near Rajwada. Wi-Fi dipped for a few minutes in the evening.", textHi: "राजवाड़ा के पास होना अच्छा लगा। शाम को वाई-फ़ाई कुछ मिनट चला गया।", ago: "3 hr ago", agoHi: "3 घंटे पहले" },
  { who: "Sanjay Rao", room: "105", score: 5, text: "Quiet room, and the poha arrived hot.", textHi: "शांत कमरा, और पोहा गरम पहुँचा।", ago: "14 hr ago", agoHi: "14 घंटे पहले" },
];

export const nearby = [
  { name: "Rajwada Palace", nameHi: "राजवाड़ा महल", walk: "8 min walk", walkHi: "8 मिनट पैदल" },
  { name: "Sarafa Bazaar", nameHi: "सराफा बाज़ार", walk: "12 min drive", walkHi: "12 मिनट गाड़ी से" },
  { name: "Khajrana Temple", nameHi: "खजराना मंदिर", walk: "20 min drive", walkHi: "20 मिनट गाड़ी से" },
];

export const requests = [
  { id: "towels", title: "Extra towels", titleHi: "अतिरिक्त तौलिये", department: "housekeeping" as const, detail: "Two bath towels", detailHi: "दो बाथ तौलिये", icon: "towels" },
  { id: "cleaning", title: "Room cleaning", titleHi: "कमरे की सफाई", department: "housekeeping" as const, detail: "Please tidy the room", detailHi: "कृपया कमरा साफ़ कर दें", icon: "cleaning" },
  { id: "luggage", title: "Luggage", titleHi: "सामान", department: "reception" as const, detail: "Help with bags", detailHi: "बैग में मदद", icon: "luggage" },
  { id: "wakeup", title: "Wake-up call", titleHi: "वेक-अप कॉल", department: "reception" as const, detail: "Morning wake-up", detailHi: "सुबह जगाने का अनुरोध", icon: "wakeup" },
  { id: "water", title: "Water", titleHi: "पानी", department: "housekeeping" as const, detail: "Two bottles", detailHi: "दो बोतलें", icon: "water" },
  { id: "repair", title: "Repair", titleHi: "मरम्मत", department: "maintenance" as const, detail: "Something needs attention", detailHi: "ध्यान देने की ज़रूरत है", icon: "repair" },
];
