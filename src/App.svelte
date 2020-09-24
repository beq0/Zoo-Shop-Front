<script>
  import { Router, Route, link } from "svelte-routing";
  import { DeviceDetectorService } from "./services/deviceDetector.service";
  import * as Config from "./config";

  import TestRoute from "./routes/Test.route.svelte"
  import Header from "./components/Header.svelte"
  import Product from "./routes/Product.route.svelte"

  // Used for SSR. A falsy value is ignored by the Router.
  export let url = "";
</script>

<Header/>

<div>
  <Router url="{url}">
    <Route path="test" component={TestRoute}></Route>
    <Route path="products" component={Product}></Route>
  </Router>  
</div>

