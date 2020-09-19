<script>
  import { Router, Route, Link } from "svelte-routing";
  import { DeviceDetectorService } from "./services/deviceDetector.service";
  import * as Config from "./config";

  import TestRoute from "./routes/Test.route.svelte"

  // Used for SSR. A falsy value is ignored by the Router.
  export let url = "";
</script>

<Router url="{url}">
    <Route path="test" component={TestRoute}></Route>
</Router>

Hello world, I wanna be a zoo shop manager one day :)