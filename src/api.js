const schema = {
  getBoards: {
    path: 'members/me/boards',
    method: 'get',
    getter: '',
    slug: 'trello_viewer_boards',
  },
  getBoardMembers: {
    path: 'boards/{{trello_selected_board}}/members',
    method: 'get',
    getter: '',
    slug: 'board-{{trello_selected_board}}-members',
  },
  getBoardLists: {
    path: 'boards/{{trello_selected_board}}/lists',
    method: 'get',
    getter: '',
    slug: 'board-{{trello_selected_board}}-lists',
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
    },
    fields: [
      {
        display: 'Name the newly created card',
        slug: 'trello_card_name',
      },
      {
        display: 'What board would you like to add the card to?',
        autocompleteAction: 'getBoards',
        autocompleteDisplay: 'name',
        autocompleteSubmit: 'id',
        slug: 'trello_selected_board',
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

function fillTemplate(state, template) {
  return template.replace(
    /{{([a-z_-]+)}}/g,
    (_, name) => state[name].submitValue || state[name],
  );
}

function triggerTrelloAction({ path, slug, method, getter = '' }) {
  let cache = {};
  return state => {
    const url = fillTemplate(state, path);
    const _slug = fillTemplate(state, slug);
    if (cache[url]) {
      state[_slug] = cache[url];
      state.lastAdded = _slug;
      return Promise.resolve(state);
    }
    return new Promise((resolve, reject) =>
      window.Trello[method](
        url,
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

const methods = Object.entries(schema).reduce(
  (p, [name, definition]) =>
    Object.assign(p, {
      [name]: triggerTrelloAction(definition),
    }),
  {},
);

export default { ...methods, schema };
