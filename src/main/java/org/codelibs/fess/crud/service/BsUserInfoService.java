/*
 * Copyright 2009-2015 the CodeLibs Project and the Others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

package org.codelibs.fess.crud.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.codelibs.fess.crud.CommonConstants;
import org.codelibs.fess.crud.CrudMessageException;
import org.codelibs.fess.db.cbean.UserInfoCB;
import org.codelibs.fess.db.exbhv.UserInfoBhv;
import org.codelibs.fess.db.exentity.UserInfo;
import org.codelibs.fess.pager.UserInfoPager;
import org.dbflute.cbean.result.PagingResultBean;
import org.seasar.framework.beans.util.Beans;

public abstract class BsUserInfoService {

    @Resource
    protected UserInfoBhv userInfoBhv;

    public BsUserInfoService() {
        super();
    }

    public List<UserInfo> getUserInfoList(final UserInfoPager userInfoPager) {

        final PagingResultBean<UserInfo> userInfoList = userInfoBhv.selectPage(cb -> {
            cb.paging(userInfoPager.getPageSize(), userInfoPager.getCurrentPageNumber());
            setupListCondition(cb, userInfoPager);
        });

        // update pager
        Beans.copy(userInfoList, userInfoPager).includes(CommonConstants.PAGER_CONVERSION_RULE).execute();
        userInfoPager.setPageNumberList(userInfoList.pageRange(op -> {
            op.rangeSize(5);
        }).createPageNumberList());

        return userInfoList;
    }

    public UserInfo getUserInfo(final Map<String, String> keys) {
        final UserInfo userInfo = userInfoBhv.selectEntity(cb -> {
            cb.query().setId_Equal(Long.parseLong(keys.get("id")));
            setupEntityCondition(cb, keys);
        }).orElse(null);//TODO
        if (userInfo == null) {
            // TODO exception?
            return null;
        }

        return userInfo;
    }

    public void store(final UserInfo userInfo) throws CrudMessageException {
        setupStoreCondition(userInfo);

        userInfoBhv.insertOrUpdate(userInfo);

    }

    public void delete(final UserInfo userInfo) throws CrudMessageException {
        setupDeleteCondition(userInfo);

        userInfoBhv.delete(userInfo);

    }

    protected void setupListCondition(final UserInfoCB cb, final UserInfoPager userInfoPager) {

        if (userInfoPager.id != null) {
            cb.query().setId_Equal(Long.parseLong(userInfoPager.id));
        }
        // TODO Long, Integer, String supported only.
    }

    protected void setupEntityCondition(final UserInfoCB cb, final Map<String, String> keys) {
    }

    protected void setupStoreCondition(final UserInfo userInfo) {
    }

    protected void setupDeleteCondition(final UserInfo userInfo) {
    }
}