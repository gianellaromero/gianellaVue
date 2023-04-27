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
      error: null,
      favorites: new Map()
    };
  },
  created(){
     const savedFavorites = JSON.parse(window.localStorage.getItem('favorites'))
    //  console.log(savedFavorites)
     if (savedFavorites && savedFavorites.length) {
      const favorites = new Map(savedFavorites.map(favorite => [favorite.id, favorite]))
      this.favorites = favorites
    }
  },
  computed:{
   isFavorite() {
      return this.favorites.has(this.result.id)
    },
   allFavorites(){
      return Array.from(this.favorites.values())
   }
  },
  methods: {
    async doSearch() {
      this.result = this.error = null;
      try {
        const response = await fetch(API + this.search);
        if (response.status == 403) throw new Error("Servidor invalido")
        if (!response.ok) throw new Error("User no found")
        //console.log(response)
        const data = await response.json();
        console.log(data);
        this.result = data;
      } catch (error) {
        this.error = error;
      } finally {
        this.search = null;
      }
    },
    addFavorite(){
      this.favorites.set(this.result.id, this.result)
      this.updateStorage()

    },
    removeFavorite() {
      this.favorites.delete(this.result.id)
      this.updateStorage()
    },
    showFavorite(favorite){
      this.result= favorite
     },
    updateStorage(){
         window.localStorage.setItem('favorites', JSON.stringify(this.allFavorites))
  }
}
});
