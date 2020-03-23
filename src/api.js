const schemaDefinition = {
  getBoards: {
    display: 'Get Boards list',
    path: 'members/me/boards',
    method: 'get',
    getter: '',
    slug: 'trello_viewer_boards',
  },
  getBoardMembers: {
    display: 'Get Board members',
    path: 'boards/{{trello_selected_board}}/members',
    method: 'get',
    getter: '',
    slug: 'board-{{trello_selected_board}}-members',
    fields: [
      {
        display: 'Board',
        autocompleteAction: 'getBoards',
        autocompleteDisplay: 'name',
        autocompleteSubmit: 'id',
        slug: 'trello_selected_board',
      },
    ],
  },
  getBoardLists: {
    display: 'Get Board lists',
    path: 'boards/{{trello_selected_board}}/lists',
    method: 'get',
    getter: '',
    slug: 'board-{{trello_selected_board}}-lists',
    fields: [
      {
        display: 'Board',
        autocompleteAction: 'getBoards',
        autocompleteDisplay: 'name',
        autocompleteSubmit: 'id',
        slug: 'trello_selected_board',
      },
    ],
  },
  createCard: {
    display: 'Trello - Create a card',
    method: 'post',
    path: '/cards',
    getter: 'id',
    slug: 'trello_created_card',
    payload: {
      pos: 'bottom',
      idList: '{{trello_selected_list}}',
      name: '{{trello_card_name}}',
      desc: '{{trello_card_desc}}',
      idMembers: ['{{trello_selected_member}}'],
    },
    fields: [
      {
        display: 'Name the newly created card',
        slug: 'trello_card_name',
      },
      {
        display: 'Describe the newly created card',
        slug: 'trello_card_desc',
      },
      {
        display: 'What list would you like to add the card to?',
        autocompleteAction: 'getBoardLists',
        autocompleteDisplay: 'name',
        autocompleteSubmit: 'id',
        slug: 'trello_selected_list',
        autocompleteError: 'You first need to fill the board input',
      },
      {
        display: 'Who would you like to assign the task to?',
        autocompleteAction: 'getBoardMembers',
        autocompleteDisplay: 'fullName',
        autocompleteSubmit: 'id',
        slug: 'trello_selected_member',
        autocompleteError: 'You first need to fill the board input',
      },
    ],
  },
};

/**
 * Here we extend each field with its dependencies
 * (autocomplete fields)
 */
const schema = Object.entries(schemaDefinition).reduce(
  (p, [n, d]) => Object.assign(p, { [n]: withSubfields(schemaDefinition, d) }),
  {},
);

/**
 * Replace the variable with their state value
 * Better: use mustache or any other template language
 */
function fillTemplate(state, template) {
  if (template instanceof Array) {
    return template.map(v => fillTemplate(state, v));
  }
  if ({}.constructor === template.constructor) {
    return Object.entries(template).reduce((p, [k, v]) => ({
      ...p,
      [k]: fillTemplate(state, v),
    }));
  }
  return template.replace(
    /{{([a-z_-]+)}}/g,
    (_, name) => state[name].submitValue || state[name],
  );
}

/**
 *
 * Given a full state and a payload definition,
 * this function will replace every variable in the payload,
 * with the values stored in the state
 */
function stateToPayload(state, payloadDefinition) {
  return Object.entries(payloadDefinition).reduce((p, [k, v]) => {
    return { ...p, [k]: fillTemplate(state, v) };
  }, {});
}

function triggerTrelloAction({ payload, path, slug, method, getter = '' }) {
  let cache = {};

  return state => {
    const url = fillTemplate(state, path);
    const _slug = fillTemplate(state, slug);
    const data = payload ? stateToPayload(state, payload) : undefined;
    if (cache[url]) {
      state[_slug] = cache[url];
      state.lastAdded = _slug;
      return Promise.resolve(state);
    }
    return new Promise((resolve, reject) =>
      window.Trello[method](
        url,
        data,
        response => {
          state[_slug] = response;
          state.lastAdded = _slug;
          return resolve(state);
        },
        reject,
      ),
    );
  };
}

/**
 * Ensure there is no field duplicated in the field list
 * of a definition in the schema
 */
function uniqueOrdered(list) {
  return list.reduce((p, c) => {
    for (const element of p) {
      if (element.display === c.display) {
        return p;
      }
    }
    return [...p, c];
  }, []);
}

/**
 * Extend the definition with its sufields from
 * autocomplete actions, and ensure they only occurs once
 */
function withSubfields(schema, definition) {
  const fields = definition.fields || [];
  const extra = fields.reduce((p, field) => {
    if (field.autocompleteAction) {
      const def = schema[field.autocompleteAction];
      return [...p, ...(def.fields || [])];
    }
    return p;
  }, []);
  return {
    ...definition,
    fields: uniqueOrdered([...extra, ...fields]),
  };
}

const methods = Object.entries(schema).reduce(
  (p, [name, definition]) =>
    Object.assign(p, {
      [name]: triggerTrelloAction(withSubfields(schema, definition)),
    }),
  {},
);

function getFields(action) {
  return schema[action].fields;
}

export default { ...methods, getFields, schema };
