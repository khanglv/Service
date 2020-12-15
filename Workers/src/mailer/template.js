// const demoTemplate = function(){
//     const tmp = `
//         <div>
//             <div class="background">
//                 <h1>My Mailer</h1>
//                 <p>Let's close the door and believe my burning heart
//                     Feeling alright, come on open up your heart
//                     Keep the candles burning
//                     Let your body melt in mine
//                     I'm living in my, living in my dreams </p>
//             </div>
//         </div>

//         <style>
//             .background{
//                 background-color: #e5e1db;
//             }
//             p{
//                 color: #ff6f00;
//             }
//         </style>
//     `
//     return tmp;
// }

module.exports = {
    template: ()=>{
        const tmp = `
            <div>
                <div style="background-color: #e5e1db">
                    <h1 style="font-size: 16px; text-algin: center">My Mailer</h1> </br>
                    <p style="color: #ff6f00">Let's close the door and believe my burning heart
                        Feeling alright, come on open up your heart
                        Keep the candles burning
                        Let your body melt in mine
                        I'm living in my, living in my dreams </p>
                </div>
            </div>
        `
        return tmp;
    }
}