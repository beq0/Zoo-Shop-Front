<script>
  import {ProductService} from "../services/product.service";
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';

  const Type = {
    FOOD: "საკვები",
    TOY: "სათამაშო",
    MEDICINE: "წამალი"
  }

  export let show;
  export let title = 'დამატება';
  export let _id, name = "", type = Type.FOOD, quantity = null, sellingPrice = null, originalPrice = null;
  export let submited = false;
  
  const productService = ProductService.getInstance();

  async function onSubmit() {
    if (name && type && quantity != null && sellingPrice != null && originalPrice != null) {
      let res = await productService.addProduct({
        name,
        type,
        quantity,
        sellingPrice,
        originalPrice
      });
      if (res.status === 200) {
        show=false;
        submited = true;
        _id = res.id;
      }
    }
  }

  onMount(() => {
    addEventListener("keyup", (event) => {
      if (show && event.key === 'Enter') {
        onSubmit();
      }
    });
  });
  
</script>

<style>
  .popup .overlay {
    position:fixed;
    top:0px;
    left:0px;
    width:100vw;
    height:100vh;
    background:rgba(0,0,0,0.7);
    z-index:1;
    display:none;
  }

  .content {
    padding: 12px 25px !important;
  }

  .popup .content {
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%) scale(0);
    background:#fff;
    z-index:2;
    text-align:center;
    padding:20px;
    box-sizing:border-box;
    font-family:"Open Sans",sans-serif;
  }

  .popup.active .overlay {
    display:block;
  }

  .popup.active .content {
    transition:all 300ms ease-in-out;
    transform:translate(-50%,-50%) scale(1);
  }

  .form-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .form-control {
    width: 300px;
  }

  .closeButton {
    background: #f15454 !important;
    border-color: #f15454 !important;
  }

  .confirmButton {
    background: #17d417 !important;
    border-color: #17d417 !important;
  }

  .modal-title {
    font-weight: bold;
  }

</style>

{#if show}
<div class="popup active" id="popup-1">
<div class="overlay" on:click={()=>{show=false}}></div>
<div class="content">  
<h5 class="modal-title">პროდუქტის {title}</h5>
<hr>
<div class="form-group">
  <div>სახელი:&emsp;</div>
  <input type="text" class="form-control" id="name" bind:value={name}>
</div>
<div class="form-group">
  <div>ტიპი:&emsp;</div>
  <select class="form-control" bind:value={type}>
    {#each Object.values(Type) as productType}
    <option>{productType}</option>
    {/each}
  </select>
</div>
<div class="form-group">
  <div>რაოდენობა:&emsp;</div>
  <input type="number" class="form-control" id="amount" bind:value={quantity}>
</div>
<div class="form-group">
  <div>გაყიდვის&nbsp;ფასი:&emsp;</div>
  <input type="number" class="form-control" id="sellPrice" bind:value={sellingPrice}>
</div>
<div class="form-group">
  <div>ყიდვის&nbsp;ფასი:&emsp;</div>
  <input type="number" class="form-control" id="buyPrice" bind:value={originalPrice}>
</div>
<hr>
<div>
  <button class="btn btn-primary confirmButton" on:click={onSubmit}>დასტური</button>
  <button class="btn btn-primary closeButton" on:click={()=>show=false}>დახურვა</button>
</div>
</div>
</div>
{/if}