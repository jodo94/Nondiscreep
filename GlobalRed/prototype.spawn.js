const creepNames = [
  "Ashley Hooters",
  "Jenny Talia",
  "Nelly Nasty",
  "Dixie Normous",
  "Anita Mann",
  "Ivana Bang",
  "Holly Peepers",
  "Patty O’Furniture",
  "Seymour Butts",
  "Anita Head",
  "Ophelia Balls",
  "Ivana Lick",
  "Maya Buttreeks",
  "Misty Climax",
  "Fanny O’Rear",
  "Sandy Cheeks",
  "Roxy Lush",
  "Trixie Tease",
  "Candy Licks",
  "Busty McStuffins",
  "Anita Bone",
  "Crystal Chandelier",
  "Vera Vixen",
  "Kiki Quickie",
  "Mona Lott",
  "Layla Legs",
  "Ivana Hump",
  "Chastity Beltless",
  "Nora Nympho",
  "Lola Lust",
  "Tara Tush",
  "Fonda Dix",
  "Anita Deep",
  "Carrie O’Naughty",
  "Bambi Bangs",
  "Ruby Rumps",
  "Ivana Spank",
  "Anita Lush",
  "Busty Bounce",
  "Sasha Slurp",
  "Rita Lick",
  "Felicity Fondle",
  "Cherry Lush",
  "Anita Screw",
  "Lacey Lays",
  "Dolly Diddle",
  "Nina Nibble",
  "Ivana Tease",
  "Candy Kisses",
  "Roxy Rumpshake",
  "Ginger Snaps",
  "Holly Humps",
  "Lola Lickers",
  "Wanda Whips",
  "Ivana Stroke",
  "Nikki Nibble",
  "Sandy Slick",
  "Anita Screwit",
  "Cherry Choke",
  "Tanya Teaser",
  "Patty Pleasure",
  "Suki Slips",
  "Crystal Cream",
  "Roxy Rubs",
  "Bambi Bounce",
  "Misty Mouthful",
  "Ivana Swallow",
  "Nora Nibble",
  "Jenny Jugs",
  "Candy Cuddles",
  "Trixie Tongue",
  "Fanny Fondue",
  "Busty Bliss",
  "Mona Moans",
  "Lola Lapdance",
  "Cherry Clutch",
  "Vicky Vixen",
  "Trina Tease",
  "Rita Rumps",
  "Kiki Kiss",
  "Dolly Drench",
  "Ruby Rumble",
  "Anita Kiss",
  "Lexi Lush",
  "Nelly Nipples",
  "Fonda Feel",
  "Ginger Grind",
  "Holly Hotness",
  "Bambi Bites",
  "Trixie Tremble",
  "Lacey Lust",
  "Nina Naughty",
  "Sasha Sizzle",
  "Roxy Rubdown",
  "Ivana Moan",
  "Anita Bite",
  "Cherry Teaser",
  "Vera Vibe",
  "Patty Passion",
  "Jenny Jiggles",
    "Anita Lickalot",
  "Misty Muffins",
  "Roxy Rumble",
  "Trixie Twirls",
  "Cherry Cheeks",
  "Fonda Fun",
  "Layla Lush",
  "Nora Nasty",
  "Lola Lap",
  "Penny Pucker",
  "Suki Slurps",
  "Ruby Rumpshake",
  "Ivana Thrill",
  "Busty Bubbles",
  "Ginger Giggles",
  "Tammy Teaser",
  "Holly Hottie",
  "Jenny Jiggle",
  "Mona Licks",
  "Sasha Sway",
  "Dolly Delight",
  "Vera Vice",
  "Rita Rascal",
  "Kiki Kisses",
  "Nikki Naughty",
  "Candy Cane",
  "Bambi Bliss",
  "Trina Tingle",
  "Nelly Nip",
  "Crystal Clutch",
  "Patty Pout",
  "Fanny Flirt",
  "Anita Naughty",
  "Lexi Licks",
  "Gigi Gush",
  "Wanda Wiggle",
  "Tara Tease",
  "Ophelia Lush",
  "Carrie Clutch",
  "Tina Tingles",
  "Cherry Lips",
  "Maya Moans",
  "Roxy Razzle",
  "Nora Nectar",
  "Sandy Sizzle",
  "Jenny Juicy",
  "Holly Heat",
  "Lacey Lures",
  "Ivy Icing",
  "Anita Rumps",
  "Bella Bounce",
  "Misty Mischief",
  "Penny Peach",
  "Kara Kiss",
  "Trixie Tush",
  "Rita Ravish",
  "Fonda Funbags",
  "Nina Nectar",
  "Suki Slick",
  "Mona Moves",
  "Bambi Bouncehouse",
  "Candy Curls",
  "Ginger Glow",
  "Tammy Tush",
  "Roxy Rubble",
  "Lola Lollipop",
  "Jenny Juices",
  "Patty Paws",
  "Chrissy Cheeks",
  "Sasha Sugars",
  "Anita Amour",
  "Fanny Fantasy",
  "Vicky Velvet",
  "Wanda Winks",
  "Lexi Lure",
  "Ruby Rave",
  "Tara Tempt",
  "Nelly Naughtybits",
  "Poppy Pouts",
  "Carrie Caress",
  "Cherry Chills",
  "Gigi Glimmer",
  "Trudy Tease",
  "Raven Rumble",
  "Lacey Lips",
  "Dolly Darling",
  "Nina Nipples",
  "Tamara Teaser",
  "Rikki Risqué",
  "Misty Marvel",
  "Kiki Kandy",
  "Ophelia Ooze",
  "Rita Razz",
  "Bella Bliss",
  "Holly Hotcake",
  "Suki Squeeze",
  "Nora Naughty",
  "Jenny Jelly",
  "Scissorme Timbers"
];


function getRandomName() {
  const index = Math.floor(Math.random() * creepNames.length);
  return creepNames[index];
}

module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
      
        /* BODY PARTS- To give each screep a body part that fulfills a function, 
            we must expend energy from the spawn/extensions to do so. The required 
            costs of body parts are as so-
            */
        function(energy,roleName) {
            // create a balanced body as big as possible with the given energy
            var numberOfParts = Math.floor(energy / 200);
            var numberOfParts_Pikemen = Math.floor(energy/130);
            var movepartsPioneers = Math.floor((energy-150) / 50);
            
            var body = [];
            if (roleName == 'warrior'){
                for (let i = 0; i <  numberOfParts; i++){
                    body.push(MOVE);
                    body.push(ATTACK);
                    body.push(TOUGH);
                    body.push(TOUGH);
                }
                
            }
            else if (roleName ==  'decoy'){
                body.push(MOVE);
                body.push(ATTACK);
            }
            else if (roleName == 'guerrilla'){
                for (let i = 0; i <  numberOfParts; i++){
                    body.push(TOUGH);
                    body.push(MOVE);
                    body.push(MOVE);
                }
                
                body.push(ATTACK);
            }
            else if (roleName == 'exterminator'){
                for (let i = 4; i <  numberOfParts; i++){
                    body.push(TOUGH);
                    body.push(TOUGH);
                }
                for (let i = 4; i <  numberOfParts; i++){
                    body.push(MOVE);
                    body.push(ATTACK);
                }
                body.push(CLAIM);
                
            }
            else if (roleName == 'quadsquad'){
                for (let i=4; i < numberOfParts; i++){
                    body.push(MOVE);
                    
                    
                }
                for (let i=4; i < numberOfParts; i++){
                    body.push(RANGED_ATTACK);
                }
         
                body.push(HEAL);
            }
            else if (roleName =='gaurd'){
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(MOVE);
                    body.push(ATTACK);
                    body.push(TOUGH);
                    body.push(MOVE);
                    body.push(TOUGH);
                    }
            }
            else if (roleName == 'claim'){
                
                for (let i = 3; i < numberOfParts; i++) {
                        body.push(MOVE); 
                    }
                for (let i = 3; i < numberOfParts; i++) {
                        body.push(MOVE);
                    }
                for (let i = 3; i < numberOfParts; i++) {
                        body.push(MOVE);
                    }
                body.push(CLAIM);
            }
            

            
            else if(roleName != 'logistics' && roleName !='claim' && roleName != 'warrior'){

                        for (let i = 0; i < numberOfParts; i++) {
                                body.push(WORK); 
                        }
                        for (let i = 0; i < numberOfParts; i++) {
                                body.push(CARRY);
                        }
                        for (let i = 0; i < numberOfParts; i++) {
                                body.push(MOVE);
                        }
                    
            }

            // create creep with the created body and the given role
            return this.createCreep(body,getRandomName(), { role: roleName, working: false, dsToken: false, prestige: 0, dfs: 0});
        };
};
