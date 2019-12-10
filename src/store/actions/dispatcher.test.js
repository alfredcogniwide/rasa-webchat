import { initStore, store } from '../store';
import { send } from './dispatcher';


describe('Dispatcher', () => {
  let sentToSocket = [];
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  };
  const mockSocket = {
    emit: jest.fn((action, message) => sentToSocket.push({ action, message }))
  };

  initStore('dummy',
    'dummy',
    mockSocket,
    localStorageMock,
    false
);
  beforeEach(() => {
    sentToSocket = [];
    initStore('dummy',
    'dummy',
    mockSocket,
    localStorageMock,
    false
);
  });
  it('should send a message to the socket and add a new message in the store', () => {
    expect(store.getState().messages.size).toEqual(0);
    expect(sentToSocket).toHaveLength(0);
    send('/payload', 'test');
    expect(store.getState().messages.size).toEqual(1);
    expect(store.getState().messages.get(0).get('text')).toEqual('test');
    expect(sentToSocket).toHaveLength(1);
    expect(sentToSocket[0].message.message).toEqual('/payload');
  });

  it('should only send a message to the socket and add a new message in the store', () => {
    expect(store.getState().messages.size).toEqual(0);
    expect(sentToSocket).toHaveLength(0);
    send('/payload');
    expect(store.getState().messages.size).toEqual(0);
    expect(sentToSocket).toHaveLength(1);
    expect(sentToSocket[0].message.message).toEqual('/payload');
  });
});
