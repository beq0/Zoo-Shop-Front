<script>
  import { Router, Route, Link } from "svelte-routing";
  import { DeviceDetectorService } from "./services/deviceDetector.service";
  import * as Config from "./config";

  // Used for SSR. A falsy value is ignored by the Router.
  export let url = "";
</script>

<Router url="{url}">
    
</Router>

Hello world, I wanna be a zoo shop manager one day :)