<script>
  import { Router, Route, link, navigate } from "svelte-routing";
  import { DeviceDetectorService } from "./services/deviceDetector.service";
  import * as Config from "./config";

  import TestRoute from "./routes/Test.route.svelte"
  import Header from "./components/Header.svelte"
  import Home from "./routes/Home.route.svelte"
  import Product from "./routes/Product.route.svelte"
  import History from "./routes/History.route.svelte"
  import Parameter from "./routes/Parameter.route.svelte"

  // Used for SSR. A falsy value is ignored by the Router.
  export let url = "";
  if(DeviceDetectorService.isBrowser && window.location.pathname == '/') {
    navigate("/home");
  }

  let showToolbar;  
</script>

<Header bind:showToolbar={showToolbar}/>

<div>
  <Router url="{url}">
    <Route path="home" component={Home}></Route>
    <Route path="products" component={Product} bind:showToolbar={showToolbar}></Route>
    <Route path="history" component={History} bind:showToolbar={showToolbar}></Route>
    <Route path="parameter" component={Parameter} bind:showToolbar={showToolbar}></Route>
  </Router>  
</div>

