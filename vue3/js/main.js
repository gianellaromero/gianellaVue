const API = "https://api.github.com/users/";
/*async function doSearch() {
   const response = await fetch(API + 'Gianella');
   const data = await response.json();
   console.log(data) */
const requestMaxTimeMs = 500000;
const app = Vue.createApp({
  data() {
    return {
      //message: "Hello Vue!",
      search: null,
      result: null,
      error: null,
      favorites: new Map(),
    };
  },
  created() {
    const savedFavorites = JSON.parse(window.localStorage.getItem("favorites"));
    //  console.log(savedFavorites)
    if (savedFavorites?.length) {
      const favorites = new Map(
        savedFavorites.map((favorite) => [favorite.login, favorite])
      );
      this.favorites = favorites;
    }
  },
  computed: {
    isFavorite() {
      return this.favorites.has(this.result.login);
    },
    allFavorites() {
      return Array.from(this.favorites.values());
    },
  },
  methods: {
    async doSearch() {
      this.result = this.error = null;
      const foundInFavorites = this.favorites.get(this.search);
       if (typeof foundInFavorites === "undefined") {
         //console.log("verdadero");
         a = true
         
       } else {
         //console.log("falso");
         a = false
       }
      console.log(foundInFavorites)
      const shouldRequestAgain = (() => {
        if (!!foundInFavorites) {
          const { lastRequestTime } = foundInFavorites;
          const now = Date.now();
          //console.log(now - lastRequestTime, requestMaxTimeMs)
          return now - lastRequestTime > requestMaxTimeMs;
        }
        return false;
      })(); //IIFE

      if (!!foundInFavorites && !shouldRequestAgain) {
        console.log("Foun and we the use cache version");
        return (this.result = foundInFavorites);
      }

      try {
        console.log("Not found or cache version is too old");
        const response = await fetch(API + this.search);
        if (response.status == 403) throw new Error("Servidor invalido");
        if (!response.ok) throw new Error("User no found");
        //console.log(response)
        const data = await response.json();
        console.log(data);
        this.result = data;
        this.result.lastRequestTime = Date.now();
        if (!a){
          foundInFavorites.lastRequestTime = Date.now()
        }
       
      } catch (error) {
        this.error = error;
      } finally {
        this.search = null;
      }
    },
    addFavorite() {
      this.result.lastRequestTime = Date.now();
      this.favorites.set(this.result.login, this.result);
      this.updateStorage();
    },
    removeFavorite() {
      this.favorites.delete(this.result.login);
      this.updateStorage();
    },
    showFavorite(favorite) {
      this.result = favorite;
    },
    updateStorage() {
      window.localStorage.setItem(
        "favorites",
        JSON.stringify(this.allFavorites)
      );
    },
  },
});
