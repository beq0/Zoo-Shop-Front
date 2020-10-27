<script>
  import { Router, Route, link } from "svelte-routing";
  import { DeviceDetectorService } from "./services/deviceDetector.service";
  import * as Config from "./config";

  import TestRoute from "./routes/Test.route.svelte"
  import Header from "./components/Header.svelte"
  import Product from "./routes/Product.route.svelte"
  import History from "./routes/History.route.svelte"

  // Used for SSR. A falsy value is ignored by the Router.
  export let url = "";

  let showToolbar = false;
</script>

<Header bind:showToolbar={showToolbar}/>

<div>
  <Router url="{url}">
    <Route path="test" component={TestRoute}></Route>
    <Route path="products" component={Product} bind:showToolbar={showToolbar}></Route>
    <Route path="history" component={History} bind:showToolbar={showToolbar}></Route>
  </Router>  
</div>

