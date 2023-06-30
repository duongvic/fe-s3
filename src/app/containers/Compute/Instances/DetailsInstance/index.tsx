import { notification, Tabs } from 'antd';
import { actions } from 'app/containers/Compute/Instances/slice';
import * as security from 'app/containers/Compute/Security/slice';
import empty from 'is-empty';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { noticficationBase } from 'utils/constant';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { securityGroupsSaga } from '../../Security/saga';
import {
  selectError,
  selectNotice,
  selectSecurityGroups,
} from '../../Security/selector';
import {
  selectActionLog,
  selectBackups,
  selectConsole,
  selectSnapshots,
} from '../selector';
import ActionLog from './ActionLog';
// import Backup from './Backup';
import Console from './Console';
import { MomorizedMonitorLog } from './MonitorLog';
import OverviewInstance from './OverviewInstance';
import SecurityInstance from './SecurityInstance';
import Snapshot from './Snapshot';
import './styles.less';

const { TabPane } = Tabs;
interface ParamTypes {
  instanceId: string;
}

export const DetailsInstance = React.memo(() => {
  useInjectSaga({ key: security.sliceKey, saga: securityGroupsSaga });
  useInjectReducer({ key: security.sliceKey, reducer: security.reducer });

  const dispatch = useDispatch();
  const { instanceId } = useParams<ParamTypes>();
  const { t } = useTranslation('constant');

  const error = useSelector(selectError);
  const notice = useSelector(selectNotice);
  const snapshots = useSelector(selectSnapshots);
  const backups = useSelector(selectBackups);
  const instanceConsole = useSelector(selectConsole);
  const securityGroups = useSelector(selectSecurityGroups);
  const actionLog = useSelector(selectActionLog);

  const onTabClick = (key, evt) => {
    dispatch(actions.setData({ instanceId }));

    if (key === '2' && empty(securityGroups)) {
      dispatch(security.actions.setData(instanceId));
      dispatch(security.actions.loadSecurityGroups());
    } else if (key === '3' && empty(snapshots)) {
      dispatch(actions.getSnapshots());
    } else if (key === '4' && empty(backups)) {
      dispatch(actions.getBackups());
    } else if (key === '5' && !instanceConsole) {
      dispatch(actions.loadConsole());
    } else if (key === '6' && empty(actionLog)) {
      dispatch(actions.getActionLog());
    }
  };

  useEffect(() => {
    if (notice) {
      noticficationBase('success', notice);
      setTimeout(() => {
        dispatch(security.actions.setData(instanceId));
        dispatch(security.actions.loadSecurityGroups());
      }, 1000);
      dispatch(actions.setNotice(null));
    }
  }, [dispatch, notice, instanceId]);

  useEffect(() => {
    if (error) {
      noticficationBase('error', error);
      dispatch(actions.setError(null));
    }
  }, [error, dispatch]);

  return (
    <div className="card-container">
      <Tabs type="card" onTabClick={onTabClick}>
        <TabPane tab={t('Title.OVERVIEW')} key="1">
          <OverviewInstance />
        </TabPane>
        <TabPane tab={t('Title.SECURITY')} key="2">
          <SecurityInstance />
        </TabPane>
        <TabPane tab={t('Title.SNAPSHOT')} key="3">
          <Snapshot />
        </TabPane>
        {/* <TabPane tab={t('Title.BACKUP')} key="4">
          <Backup />
        </TabPane> */}
        <TabPane tab={t('Title.CONSOLE')} key="5">
          <Console></Console>
        </TabPane>
        <TabPane tab={t('Title.ACTION_LOG')} key="6">
          <ActionLog />
        </TabPane>
        <TabPane tab={t('Title.MONITOR')} key="7">
          <MomorizedMonitorLog />
        </TabPane>
      </Tabs>
    </div>
  );
});
