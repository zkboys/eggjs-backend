import React, { useEffect, useState } from 'react';
import { Button, Form } from 'antd';

import PageContent from 'src/layouts/page-content';
import config from 'src/commons/config-hoc';
import batchDeleteConfirm from 'src/components/batch-delete-confirm';
import { useGet, useDel } from 'src/commons/ajax';
import api from './useApi';
import {
    FormElement,
    FormRow,
    Operator,
    Pagination,
    QueryBar,
    Table,
} from 'src/library/components';

import EditModal from './EditModal';

export default config({
    path: '/users',
    title: '用户管理',
})(() => {
    // 数据定义
    const [ { condition, pageSize, pageNum }, setCondition ] = useState({ condition: {}, pageSize: 20, pageNum: 1 });
    const [ dataSource, setDataSource ] = useState([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useState([]);
    const [ total, setTotal ] = useState(0);
    const [ visible, setVisible ] = useState(false);
    const [ id, setId ] = useState(null);
    const [ form ] = Form.useForm();

    // 请求相关定义 只是定义，不会触发请求，调用相关函数，才会触发请求
    const [ loading, fetchUsers ] = useGet('/users');
    const [ deleting, deleteUsers ] = api.deleteUsers(); // 可以单独封装成api
    const [ deletingOne, deleteUser ] = useDel('/users/:id', { successTip: '删除成功！', errorTip: '删除失败！' });

    const columns = [
        { title: '用户名', dataIndex: 'name', width: 200 },
        { title: '职位', dataIndex: 'position', width: 200 },
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const { id, name } = record;
                const items = [
                    {
                        label: '编辑',
                        onClick: () => setVisible(true) || setId(id),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${name}"?`,
                            onConfirm: () => handleDelete(id),
                        },
                    },
                ];

                return <Operator items={items}/>;
            },
        },
    ];

    // 函数定义
    async function handleSearch() {
        if (loading) return;
        const params = {
            ...condition,
            pageNum,
            pageSize,
        };

        const res = await fetchUsers(params);

        setDataSource(res?.rows || []);
        setTotal(res?.count || 0);
    }

    async function handleDelete(id) {
        if (deletingOne) return;

        await deleteUser(id);
        await handleSearch();
    }

    async function handleBatchDelete() {
        if (deleting) return;

        await batchDeleteConfirm(selectedRowKeys.length);

        await deleteUsers({ ids: selectedRowKeys });
        setSelectedRowKeys([]);
        await handleSearch();
    }

    // effect 定义
    // condition pageNum pageSize 改变触发查询
    useEffect(() => {
        handleSearch();
    }, [
        condition,
        pageNum,
        pageSize,
    ]);

    // jsx 用到的数据
    const formProps = { width: 200 };
    const pageLoading = loading || deleting || deletingOne;
    const disabledDelete = !selectedRowKeys?.length || pageLoading;

    return (
        <PageContent loading={pageLoading}>
            <QueryBar>
                <Form form={form} onFinish={condition => setCondition({ condition, pageSize, pageNum: 1 })}>
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="名称"
                            name="name"
                        />
                        <FormElement
                            {...formProps}
                            label="职位"
                            name="position"
                        />
                        <FormElement layout>
                            <Button type="primary" htmlType="submit">提交</Button>
                            <Button onClick={() => form.resetFields()}>重置</Button>
                            <Button type="primary" onClick={() => setVisible(true) || setId(null)}>添加</Button>
                            <Button danger disabled={disabledDelete} onClick={handleBatchDelete}>删除</Button>
                        </FormElement>
                    </FormRow>
                </Form>
            </QueryBar>
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                serialNumber
                pageNum={pageNum}
                pageSize={pageSize}
            />
            <Pagination
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onPageNumChange={pageNum => setCondition({ condition, pageSize, pageNum })}
                onPageSizeChange={pageSize => setCondition({ condition, pageSize, pageNum: 1 })}
            />
            <EditModal
                visible={visible}
                id={id}
                isEdit={id !== null}
                onOk={() => setVisible(false) || handleSearch()}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
