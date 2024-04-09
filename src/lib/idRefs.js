import { getContext, setContext } from 'svelte';

/**
 * @typedef {Partial<{ suffix: number }>} IdRefsOptions;
 * @typedef {ReturnType<typeof createIdRefsContext>} IdRefs;
 */

const contextName = 'idRefs';

/**
 * Create a new idRefs context.
 *
 * @param {IdRefsOptions} options
 */
export function createIdRefsContext(options = { suffix: 3 }) {
  // make sure we are not creating another context
  if (getContext(contextName)) {
    throw new Error('trying to create another idRefs context.');
  }

  /** @type {Map<string, Set<string>>} */
  const idMap = new Map();

  /**
   * @param {string} key
   * @param {number} length
   */
  function findUniqueId(key, length) {
    let id = buildRandomId(key, length);
    let existingIds = idMap.get(id);
    while (existingIds) {
      for (let i = 0; i < 10; i++) {
        id = buildRandomId(key, length);
        existingIds = idMap.get(id);
        if (!existingIds) return id;
      }

      // retry with longer length, forever.
      length += 1;
    }
    return id;
  }

  /**
   * Build unique id within this context.
   *
   * @param {string} key
   */
  function newId(key) {
    let length = options?.suffix ?? 3;

    const id = findUniqueId(key, length);

    if (!idMap.has(key)) {
      idMap.set(key, new Set());
    }
    idMap.get(key).add(id);

    console.log('new id:', id, { key }, '=>', idMap.size);
    return id;
  }

  /**
   * Retrieve id for this key.
   *
   * @param {string} key
   */
  function getIdsByKey(key) {
    const ids = idMap.get(key);
    if (!ids) {
      console.error('id not found for key:', key);
      throw new Error('id not found');
    }
    return ids;
  }

  const idRefs = {
    newId,
    getId: getIdsByKey,

    /**
     * Get, or create new id for this key.
     *
     * WARN This may not be what you want, because it loses the ability to check for dupliates.
     *
     * @param {string} key
     */
    getOrCreate(key) {
      if (!idMap.get(key)) {
        return newId(key);
      }
      return idMap.get(key);
    },
  };

  setContext(contextName, idRefs);

  return idRefs;
}

export function useIdRefs() {
  /** @type {IdRefs} */
  const idRefs = getContext(contextName);
  if (!idRefs) {
    throw new Error(
      'No previously declared idRefs. Maybe you forgot to do `createIdRefsContext`?',
    );
  }

  return idRefs;
}

/**
 * @param {string} prefix
 * @param {number} length
 */
function buildRandomId(prefix, length) {
  return `${prefix}-${randomId(length)}`;
}

/**
 * @param {number} length
 */
function randomId(length) {
  //return (Math.random() + 1).toString(36).substring(7);

  const arr = new Uint8Array(length || 40);
  crypto.getRandomValues(arr);
  return Array.from(arr, alphanumeric).join('').slice(0, length);

  /**
   * @param {number} dec
   */
  function dec2hex(dec) {
    return dec.toString(16).padStart(2, '0');
  }
  /**
   * @param {number} n
   */
  function alphanumeric(n) {
    return n.toString(36);
  }
}
