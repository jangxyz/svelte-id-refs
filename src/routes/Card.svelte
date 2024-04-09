<script>
	import { useIdRefs } from '$lib/idRefs.js';
	import WithId from '$lib/WithId.svelte';

	const idRefs = useIdRefs();

	export let name;
</script>

<fieldset>
	<legend>Card</legend>

	<div class="grid">
		<WithId idKey="name" {idRefs} let:id={nameId}>
			<label for={nameId} title="id={nameId}">Name</label>
			<input id={nameId} name="name" value={name} />
		</WithId>

		<WithId idKey="email" {idRefs} let:id={emailId}>
			<label for={emailId} title="id={emailId}">Email</label>
			<input id={emailId} name="email" />
		</WithId>
	</div>
</fieldset>

<style>
	fieldset {
		width: max-content;
		margin-block: 1rem;
		border-radius: 2px;
	}
	legend {
		padding-inline: 0.5rem;
	}

	.grid {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem 1rem;
	}
</style>
