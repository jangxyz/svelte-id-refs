<script>
	import WithId from '$lib/WithId.svelte';

	export let name;
</script>

<div>
	<WithId idKey="name" {idRefs} let:id>
		<label for={id}></label>
		<input {id} name="name" value={name} />
	</WithId>
</div>
