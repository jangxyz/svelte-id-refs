<script>
	import { useIdRefs } from './idRefs.js';

	/** @type {string} */
	export let idKey;

	/** @type {import('./idRefs.js').IdRefs | undefined}*/
	let idRefsProp = undefined;
	export { idRefsProp as idRefs };

	$: idRefs = idRefsProp ?? useIdRefs();
</script>

<slot id={idRefs.newId(idKey)} />
