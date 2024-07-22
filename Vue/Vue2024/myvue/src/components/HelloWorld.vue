<template>
	<h2>{{ msg }}</h2>
</template>

<script>
export default {
	name: 'HelloWorld',
	props: {
		msg: String
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
	color:rgb(119, 1, 1);
}
</style>
