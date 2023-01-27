<template>
  <!-- eslint-disable -->
 <CButton color="primary" type="submit" class="px-4">
    <div v-if="isSendingForm" class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
    </div> 
    {{title}}
 </CButton>
</template>

<script>
/* eslint-disable */ 
export default{
    name: "SubmitButton",
    props: ['title','isSendingForm'],
}

</script>