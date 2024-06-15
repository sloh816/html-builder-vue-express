<script setup>
const props = defineProps(["data", "flex"]);
const classes = `key-value-pairs ${props.flex}`;
</script>

<template>
	<div :class="`${classes}`">
		<div v-for="(value, key) in data" :key="key" class="key-value">
			<p>
				<strong>{{ key }}:</strong>
			</p>
			<p>{{ value }}</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.key-value-pairs {
	margin: 2rem 0;
}

.flex-row {
	display: flex;
	flex-direction: row;
	gap: 8rem;
}

.flex-column {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.key-value {
	line-height: 1.6;
}
</style>
