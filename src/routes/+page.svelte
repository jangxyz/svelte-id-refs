<script>
	import { createIdRefsContext } from '$lib/idRefs.js';
	import Card from './Card.svelte';

	createIdRefsContext({ suffix: 3 });
</script>

<Card name="user1" />
<Card name="user2" />
