class Model {
  constructor(initState) {
    this.state = initState;
    this.listeners = [];
  }

  reducer(state, _action) {
    return state;
  }

  subscribe(listener) {
    const index = this.listeners.push(listener) - 1;
    return () => this.listeners.splice(index, 1);
  }

  dispatch(action) {
    const nextState = this.reducer(this.state, action);

    this.listeners.forEach(listener => {
      listener(nextState);
    });

    this.state = nextState;
  }
}

class View {
  tagName = 'div';

  constructor(id, children = []) {
    this.id = id;
    this.children = children;
  }

  init() {
    this.element = document.createElement(this.tagName);
    this.element.id = this.id;
  }

  template(_state) {
    return '';
  }

  render(state) {
    if (this.children.length > 0) {
      this.children.forEach(child => child.render(state));
    } else {
      this.element.innerHTML = this.template(state);
    }
  }

  bindEventHandlers(_actions) {}

  mount(parentElement, actions = {}) {
    this.init();
    this.bindEventHandlers(actions);
    this.children.forEach(child => child.mount(this.element, actions));
    parentElement.appendChild(this.element);
  }
}

class Controller {
  actions(_dispatch) {
    return {};
  }

  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  start(root) {
    this.view.mount(root, this.actions(this.model.dispatch.bind(this.model)));
    this.model.subscribe(this.view.render.bind(this.view));
    this.model.dispatch({});
  }
}

class CounterModel extends Model {
  reducer(state, action) {
    switch (action.type) {
      case 'INC':
        return { ...state, count: state.count + 1 };
      case 'DEC':
        return { ...state, count: state.count - 1 };
      default:
        return state;
    }
  }
}

class CountView extends View {
  tagName = 'span';

  template({ count }) {
    return count;
  }
}

class IncrementView extends View {
  tagName = 'button';

  template() {
    return 'increment';
  }

  bindEventHandlers({ inc }) {
    this.element.addEventListener('click', inc);
  }
}

class DecrementView extends View {
  tagName = 'button';

  template() {
    return 'decrement';
  }

  bindEventHandlers({ dec }) {
    this.element.addEventListener('click', dec);
  }
}

class CounterController extends Controller {
  actions(dispatch) {
    return {
      inc() {
        dispatch({ type: 'INC' });
      },

      dec() {
        dispatch({ type: 'DEC' });
      },
    };
  }
}

const countView = new CountView('counter');
const incrementView = new IncrementView('increment');
const decrementView = new DecrementView('decrement');

const appModel = new CounterModel({ count: 0 });
const appView = new View('app', [countView, incrementView, decrementView]);
const appController = new CounterController(appModel, appView);
appController.start(document.getElementById('root'));
