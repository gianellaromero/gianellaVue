const API = "https://api.github.com/users/";
/*async function doSearch() {
   const response = await fetch(API + 'Gianella');
   const data = await response.json();
   console.log(data)*/
const app = Vue.createApp({
   data() {
      return {
         //message: "Hello Vue!",
         search: null,
         result: null,
         error: null
      }
   },
   methods: {
      async doSearch() {
         this.result = this.error = null
         try {
            const response = await fetch(API + this.search)
            if (response.status = 403) throw new Error ("Servidor invalido")
            if (!response.ok) throw new Error("User no found")                                
            //console.log(response)
            const data = await response.json()
            console.log(data)
            this.result = data
         } catch (error) {
            this.error = error
         }
         finally {
            this.search = null
         }
      }
   }
});
