<script>
  import { Router, Route, link, navigate } from "svelte-routing";
  import { DeviceDetectorService } from "./services/deviceDetector.service";
  import * as Config from "./config";

  import Header from "./components/Header.svelte"
  import Home from "./routes/Home.route.svelte"
  import Product from "./routes/Product.route.svelte"
  import History from "./routes/History.route.svelte"
  import Parameter from "./routes/Parameter.route.svelte"
  import Sell from "./routes/Sell.route.svelte"
  import Management from "./routes/Management.route.svelte"

  // Used for SSR. A falsy value is ignored by the Router.
  export let url = "";

  if(DeviceDetectorService.isBrowser && window.location.pathname == '/') {
    navigate("/home");
  }
  
  let show;
  let pathName = "/home";

  //scanner listener
  let dataForSellRoute = {
    keysPressed : "",
    add : false
  }
  let lastPressTime = new Date();
  if(DeviceDetectorService.isBrowser) {
    window.addEventListener("keyup", (event) => {
      let pressTime = new Date();
      if(pressTime - lastPressTime > 80) {
        dataForSellRoute.keysPressed = "";
      }
      if(event.key === 'Enter') {
        if(pressTime - lastPressTime > 80) return;
        if(window.location.pathname === '/scanner') {
          dataForSellRoute.add = true;
          return;
        } 
        navigate("/scanner");
        dataForSellRoute.add = true;
        pathName = "/scanner";
        return;
      }
      dataForSellRoute.keysPressed += event.key;
      lastPressTime = pressTime;
    });
  }


</script>

<Header 
bind:show={show}
bind:pathName={pathName}
/>

<div>
  <Router url="{url}">
    <Route path="home" component={Home}></Route>
    <Route path="products" component={Product} bind:show={show}></Route>
    <Route path="history" component={History} bind:show={show}></Route>
    <Route path="parameter" component={Parameter} bind:show={show}></Route>
    <Route path="scanner" component={Sell} bind:data={dataForSellRoute}></Route>
    <Route path="management" component={Management} bind:show={show}></Route>
  </Router>  
</div>

