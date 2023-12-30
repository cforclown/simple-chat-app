import { takeLatest, all, fork, put } from 'redux-saga/effects';
import { IMessage } from 'chat-app.contracts';
import { getMsgsAction } from './messages-actions';
import { setMsgsLoading, setMsgs } from '.';
import { sagaWrapperWithLoading } from '@/store/store-utils';
import { getChannelMsgs } from '../../../pages/home/pages/channels/channels.service';

function* setLoading(loading: boolean) {
  yield put(setMsgsLoading(loading));
}

function* getMsgsData(action: any) {
  const msgs: IMessage[] = yield getChannelMsgs(action.payload);
  yield put(setMsgs(msgs));
}

function* getMsgsSaga() {
  yield takeLatest(
    getMsgsAction.toString(), 
    function* (action: any) {
      yield sagaWrapperWithLoading(getMsgsData, setLoading, action);
    }
  );
}

function* msgsSaga() {
  yield all([
    fork(getMsgsSaga)
  ]);
}

export default msgsSaga;
