<script setup>
import FileInput from '@/components/formComponents/FileInput.vue';
import Button from '@/components/Button.vue'
</script>

<template>
    <form class="container">
        <FileInput label="Upload an Easy Read Word document:" name="EasyReadWordFile"/>
        <Button class="primary text-m" type="submit">Submit</Button>
    </form>
</template>