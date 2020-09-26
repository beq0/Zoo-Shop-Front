<script>
    import {link} from "svelte-routing";
    import {DeviceDetectorService} from "../services/deviceDetector.service";

    let pathName = '/home';
    export let showToolbar = false;

    $: {
        if(DeviceDetectorService.isBrowser) {
            pathName = window.location.pathname;
        }
    }
    
</script>

<style>
    #mainHeader {
        width: 100%;
        background-color: #42ceeb;
    }

    #pills-tab {
        margin: 0px !important;
    }

    .nav-link {
        background-color: #42ceeb;
        color: white;
    }
    
    .active {
        background-color: #3cb5cf !important;
    }

    .nav {
        display: flex;
        align-items: center;
    }

    .lastItem {
        margin-right: auto;
    }
 
    .filterImage {
        margin-right: 5px;
    }
</style>

<div id="mainHeader">
    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
    <li class="nav-item">
        <a class="{'nav-link ' + (pathName === '/home' ? 'active' : '')}" id="pills-home-tab" data-toggle="pill" href="home" role="tab" aria-controls="home" use:link
        on:click={() => pathName='/home'}>Home</a>
    </li>
    <li class="nav-item">
        <a class="{'nav-link ' + (pathName === '/products' ? 'active' : '')}" id="pills-profile-tab" data-toggle="pill" href="products" role="tab" aria-controls="products" use:link
        on:click={() => pathName='/products'}>Products</a>
    </li>
    <li class="nav-item lastItem">
        <a class="{'nav-link ' + (pathName === '/history' ? 'active' : '')}" id="pills-contact-tab" data-toggle="pill" href="history" role="tab" aria-controls="histroy" use:link
        on:click={() => pathName='/history'} >Histroy</a>
    </li>
    {#if pathName === '/products'}
    <li>
        <div data-tooltip="გაფილტრვა" data-tooltip-location="left">
            <!-- svelte-ignore a11y-missing-attribute -->
            <input class="filterImage" type="image" 
            src="images/showFilter.png" width="27px" height="27px" on:click={()=>showToolbar=!showToolbar}>
        </div>
    </li>
    {/if}
    </ul>
</div>