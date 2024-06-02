<script setup>
import { computed } from "vue";
const props = defineProps(["summary", "showButton", "hideButton"]);
const show = computed(() => props.showButton !== undefined ? props.showButton : "Show")
const hide = computed(() => props.hideButton !== undefined ? props.hideButton : "Hide")
</script>

<template>
    <div class="accordion">
        <div class="accordion__summary">
            <h2>{{ summary }}</h2>
            <button class="button secondary" type="button" @click="toggleAccordion" :aria-expanded="isOpen">
                <span v-if="!isOpen">{{ show }}</span>
                <span v-if="isOpen">{{ hide }}</span>
            </button>
        </div>
        <div v-show="isOpen" class="accordion__detail"><slot /></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isOpen: false
            }
        },

        methods: {
            toggleAccordion(event) {
                const button = event.currentTarget;
                this.isOpen = !this.isOpen;
                button.setAttribute("aria-expanded", this.isOpen);
            }
        }
    }
</script>

<style lang="scss">
.accordion {
    background: var(--slate-200);
    padding: 1rem 2rem;
    border-radius: 1rem;

    &__summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        h2 {
            margin: 0;
        }

        button {
            margin: 0;
        }
    }

    &__detail {
        padding-top: 2rem;
    }
}
</style>
