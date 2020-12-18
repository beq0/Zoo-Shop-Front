<script>
  import {ProductService} from "../services/product.service";
  import { ParameterService } from "../services/parameter.service";
  import { onMount } from 'svelte';
  import WarningModal from './WarningModal.svelte'

  const ParameterType = {
    INTEGER: "რიცხვი",
    STRING: "ტექსტი",
    LIST: "სია"
  }

  let ProductType = [
    "სხვა"
  ]

  const QuanitityType = {
    COUNT: "ცალობითი",
    WEIGHT: "წონითი"
  }

  export let show;
  export let title = 'დამატება';
  export let _id, productCode = null, name = "", productType = ProductType[0], 
          sellingPrice = null, originalPrice = null, quantity = null, quantityType = QuanitityType.COUNT, official = true;
  export let submited = false, editedQuantities = [];
  export let isChange;

  const productService = ProductService.getInstance();
  const parameterService = ParameterService.getInstance();

  let showWarningModal = false, warningModalMessage = '';
  
  onMount(() => {
    addEventListener("keyup", (event) => {
      if (show && event.key === 'Enter') {
        onSubmit();
      }
      if (show && event.key === 'Escape') {
        onClose();
      }
    });
    initializeParameters()
  });

  async function initializeParameters() {
    let res = await parameterService.getParameter("productTypes", ParameterType.LIST, ["სხვა"]);
    ProductType = ('' + res.value).split(",");
  }
  
  async function onSubmit() {
    const filteredEditedQuantities = editedQuantities.filter(q => q.quantity !== null && q.originalPrice !== null);
    let updatedProduct = {
      _id,
      code: productCode,
      name,
      productType,
      sellingPrice,
      originalPrice,
      quantity: filteredEditedQuantities,
      quantityType,
      official
    }
    if (name && productType && sellingPrice != null) {
      let res = null
      if (!isChange) res = await productService.addProduct(updatedProduct);
      else res = await productService.changeProduct(updatedProduct)
      if (res.status === 200) {
        show=false;
        submited = true;
        _id = res._id;
      } else {
        warningModalMessage = 'დაფიქსირდა შეცდომა პროდუქტის ' + (isChange ? 'რედაქტირების' : 'დამატების') + ' დროს!';
        showWarningModal = true;
      }
    }
  }

  function onClose() {
    editedQuantities = []
    show = false;
    _id = null
    productCode = null
    name = null;
    productType = ProductType[0];
    sellingPrice = null;
    originalPrice = null;
    quantity = null;
    quantityType = QuanitityType.COUNT; 
    official = true;
  }

</script>

<style>
  
  .form-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .label {
    margin-right: 15px;
  }

  #quantity-label {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 50px;
  }

  .form-control {
    width: 300px;
  }

  #official {
    height: 17px;
    box-shadow: none;
  }

  .quantities {
    display: flex;
    flex-direction: column;
  }

  .quantities-info {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .quantity-info-width {
    width: 150px;
  }

  #quantity-pairs {
    max-height: 115px; 
    margin-top: 10px;
  }

</style>

{#if show}
<div class="popup active" id="popup-1">
  <div class="overlay" on:click={onClose}></div>
    <div class="content">  
    <h5 class="modal-title">პროდუქტის {title}</h5>
    <hr>
    <div class="form-group">
      <div class="label">კოდი:</div>
      <input type="text" class="form-control" bind:value={productCode} required>
    </div>
    
    <div class="form-group">
      <div class="label">სახელი:</div>
      <input type="text" class="form-control" bind:value={name} required>
    </div>
    
    <div class="form-group">
      <div class="label">ტიპი:</div>
      <select class="form-control" bind:value={productType} required>
        {#each Object.values(ProductType) as productType}
        <option>{productType}</option>
        {/each}
      </select>
    </div>
    
    <div class="form-group">
      <div class="label">გაყიდვის&nbsp;ფასი:</div>
      <input type="number" class="form-control" bind:value={sellingPrice}>
    </div>
    
    <div class="form-group">
      <div class="label">ყიდვის&nbsp;ფასი:</div>
      <input type="number" class="form-control" bind:value={originalPrice} readonly>
    </div>
    
    <div class="form-group">
      <div id="quantity-label" class="label">
        <div>რაოდენობები:</div>
        <!-- svelte-ignore a11y-missing-attribute -->
        <input type="image" src="images/add.jpg" width="23px" height="23px" on:click={() => {
          editedQuantities.push({
            quantity: null,
            originalPrice: null,
            createDate: new Date()
          });
          editedQuantities = editedQuantities;
        }}>
      </div>
      <div class="quantities">
        <div class="quantities-info">
          <div class="quantity-info-width">რაოდენობა</div>
          <div class="quantity-info-width">ყიდვის ფასი</div>
        </div>
        <div id="quantity-pairs" style="{editedQuantities.length <= 3 ? "" : "overflow-y: scroll;"}">
          {#each editedQuantities as qt, i}
          <div class="quantities-info">
            <input type="number" class="form-control" style="width: {editedQuantities.length <= 3 ? "150" : "140"}px;" bind:value={qt.quantity}>
            <input type="number" class="form-control" style="width: {editedQuantities.length <= 3 ? "150" : "140"}px;" bind:value={qt.originalPrice}>
            <!-- svelte-ignore a11y-missing-attribute -->
            <input type="image" src="images/delete.png" style="margin-left: 5px;" width="23px" height="23px" on:click={() => {
            }}> 
          </div>
          {/each}
        </div>
      </div>
    </div>
    
    <div class="form-group">
      <div class="label">რაოდ. ტიპი:</div>
      <select class="form-control" bind:value={quantityType} required>
        {#each Object.values(QuanitityType) as quantityType}
        <option>{quantityType}</option>
        {/each}
      </select>
    </div>
    
    <div class="form-group">
      <div class="label">ოფიციალური:</div>
      <input type="checkbox" class="form-control" id="official" bind:checked={official} required>
    </div>
    <hr>
    <div>
      <button class="btn btn-primary confirmButton" on:click={onSubmit}>დასტური</button>
      <button class="btn btn-primary closeButton" on:click={onClose}>დახურვა</button>
    </div>
  </div>
</div>
{/if}


<WarningModal
bind:show={showWarningModal}
bind:message={warningModalMessage}
/>