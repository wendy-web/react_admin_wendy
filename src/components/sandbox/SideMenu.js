import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import '../../css/sideMenu.scss';
import {
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';


const { Sider } = Layout;
function  SideMenu(props) {
  const { role: {rights}} = JSON.parse(localStorage.getItem('token'));
  // console.log(rights,'rights')

  const [list, setList] = useState([]);
  // 根据地址 - 展开menu的显示
  const selectKey = useLocation().pathname;
  const openKey = ['/'+selectKey.split('/')[1]]
  useEffect(() => {
    axios.get('/rights?_embed=children').then((res) => {
      // console.log('get的数据：', res.data);
      setList(filterList(res.data));
      // console.log(filterList(res.data), "filterList(res.data)")
    });
  }, [])
  const navigate = useNavigate();
  const onClick = (e) => {
    // console.log('click ', e);
    navigate(e.key);
  };
  // 对应key值的icon图标
  const iconList = {
    '/home': <UserOutlined />,
    '/user-manage': <UserOutlined />,
    '/right-manage': <UserOutlined />,
    '/right-manage/right/list': <UserOutlined />,
    '/right-manage/role/list': <UserOutlined />,

  }
  const filterList = (list) => {
    return list.map((item) => {
      const itemObj = {
        label: item.title,
        key: item.key,
        id: item.id,
        icon: iconList[item.key]
      };
      if(item.children?.length) {
        itemObj.children = filterList(item.children);
      }
      // 判断是否打开权限
      if(item.pagepermisson && rights.includes(item.key)) {
        return itemObj;
      }
      return null;
    });
  }

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div className='menu__box'>
        <div className="logo">用户权限管理系统</div>

        <Menu
          onClick={onClick}
          style={{width: '100%'}}
          selectedKeys={selectKey}
          defaultOpenKeys={openKey}
          mode="inline"
          items={list}
          className="menu__con"
        />
      </div>
    </Sider>
  )
}
const mapStateToProps = (state) => {
  const { CollApsedReducer } = state
  return {
    isCollapsed: CollApsedReducer.isCollapsed
  }
}

export default connect(mapStateToProps)(SideMenu);