<script>
  import {ProductService} from "../services/product.service";
  import { onMount } from 'svelte';

  const ProductType = {
    FOOD: "საკვები",
    TOY: "სათამაშო",
    MEDICINE: "წამალი",
    ANIMAL: "ცხოველი",
    OTHER: "სხვა"
  }

  const QuanitityType = {
    COUNT: "რაოდენობითი",
    WEIGHT: "წონითი"
  }

  export let show;
  export let title = 'დამატება';
  export let _id, productCode = null, name = "", productType = ProductType.FOOD, 
          sellingPrice = null, originalPrice = null, quantity = null, quantityType = QuanitityType.COUNT;
  export let submited = false;
  export let isChange;
  
  const productService = ProductService.getInstance();

  async function onSubmit() {
    let updatedProduct = {
      _id,
      code: productCode,
      name,
      productType,
      sellingPrice,
      originalPrice,
      quantity,
      quantityType
    }
    if (name && productType && quantity != null && sellingPrice != null && originalPrice != null) {
      let res = null
      if (!isChange) res = await productService.addProduct(updatedProduct);
      else res = await productService.changeProduct(updatedProduct)
      if (res.status === 200) {
        show=false;
        submited = true;
        _id = res._id;
      }
    }
  }

  function onClose() {
    show = false;
    _id = null
    productCode = null
    name = null;
    productType = ProductType.FOOD;
    sellingPrice = null;
    originalPrice = null;
    quantity = null;
    quantityType = QuanitityType.COUNT; 
  }

  onMount(() => {
    addEventListener("keyup", (event) => {
      if (show && event.key === 'Enter') {
        onSubmit();
      }
      if (show && event.key === 'Escape') {
        onClose();
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
  <div class="overlay" on:click={onClose}></div>
    <div class="content">  
    <h5 class="modal-title">პროდუქტის {title}</h5>
    <hr>
    <div class="form-group">
      <div>კოდი:&emsp;</div>
      <input type="text" class="form-control" id="productCode" bind:value={productCode}>
    </div>
    <div class="form-group">
      <div>სახელი:&emsp;</div>
      <input type="text" class="form-control" id="name" bind:value={name}>
    </div>
    <div class="form-group">
      <div>ტიპი:&emsp;</div>
      <select class="form-control" bind:value={productType}>
        {#each Object.values(ProductType) as productType}
        <option>{productType}</option>
        {/each}
      </select>
    </div>
    <div class="form-group">
      <div>გაყიდვის&nbsp;ფასი:&emsp;</div>
      <input type="number" class="form-control" id="sellPrice" bind:value={sellingPrice}>
    </div>
    <div class="form-group">
      <div>ყიდვის&nbsp;ფასი:&emsp;</div>
      <input type="number" class="form-control" id="buyPrice" bind:value={originalPrice}>
    </div>
    <div class="form-group">
      <div>რაოდენობა:&emsp;</div>
      <input type="number" class="form-control" id="amount" bind:value={quantity}>
    </div>
    <div class="form-group">
      <div>რაოდ. ტიპი:&emsp;</div>
      <select class="form-control" bind:value={quantityType}>
        {#each Object.values(QuanitityType) as quantityType}
        <option>{quantityType}</option>
        {/each}
      </select>
    </div>
    <hr>
    <div>
      <button class="btn btn-primary confirmButton" on:click={onSubmit}>დასტური</button>
      <button class="btn btn-primary closeButton" on:click={onClose}>დახურვა</button>
    </div>
  </div>
</div>
{/if}