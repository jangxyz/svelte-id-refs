<script>
	/** @type {string} */
	export let idKey;

	/** @type {import('./idRefs.js').IdRefs}*/
	let idRefsProp;
	export { idRefsProp as idRefs };

	$: idRefs = idRefsProp;
</script>

<slot id={idRefs.newId(idKey)} />
