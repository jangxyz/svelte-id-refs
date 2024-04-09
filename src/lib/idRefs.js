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
 * @returns
 */
export function createIdRefsContext(options = { suffix: 3 }) {
  // make sure we are not creating another context
  if (getContext(contextName)) {
    throw new Error('trying to create another idRefs context.');
  }

  const idMap = new Map();

  /**
   * @param {string} key
   */
  function newId(key) {
    let length = options?.suffix ?? 3;

    /**
     * @param {string} key
     * @param {number} length
     */
    function buildRandomId(key, length) {
      return `${key}-${randomId(length)}`;
    }

    const id = (() => {
      let id = buildRandomId(key, length);
      let existing = idMap.get(id);
      while (existing) {
        for (let i = 0; i < 10; i++) {
          id = buildRandomId(key, length);
          existing = idMap.get(id);
          if (!existing) return id;
        }

        // retry with longer length, forever.
        length += 1;
      }
      return id;
    })();

    idMap.set(key, id);

    return id;
  }

  const idRefs = {
    /** Build unique id within this context. */
    newId,

    //unique(key: string) {
    //  const existing = idMap.get(key);
    //  if (existing) {
    //    console.error('id already exists for key:', key);
    //    throw new Error('duplicate id');
    //  }
    //  return key;
    //},

    /**
     * Retrieve id for this key.
     *
     * @param {string} key
     */
    getId(key) {
      if (!idMap.get(key)) {
        console.error('id not found for key:', key);
        throw new Error('id not found');
      }
      return key;
    },

    /**
     * Get, or create new id for this key.
     *
     * WARN This may not be what you want, because it loses the ability to check for dupliates.
     *
     * @param {string} key
     */
    getOrCreate(key) {
      if (!idMap.get(key)) {
        console.log(1);
        return newId(key);
      }
      console.log(2);
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
