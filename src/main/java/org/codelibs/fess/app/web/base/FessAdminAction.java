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
package org.codelibs.fess.app.web.base;

import java.util.function.Consumer;

import javax.servlet.ServletContext;

import org.codelibs.core.beans.util.BeanUtil;
import org.codelibs.core.beans.util.CopyOptions;
import org.codelibs.fess.mylasta.action.FessMessages;
import org.dbflute.optional.OptionalThing;
import org.lastaflute.di.util.LdiFileUtil;
import org.lastaflute.web.callback.TypicalEmbeddedKeySupplier;
import org.lastaflute.web.callback.TypicalKey.TypicalSimpleEmbeddedKeySupplier;
import org.lastaflute.web.login.LoginManager;
import org.lastaflute.web.util.LaServletContextUtil;
import org.lastaflute.web.validation.VaMessenger;

/**
 * @author codelibs
 * @author jflute
 */
public abstract class FessAdminAction extends FessBaseAction {

    // ===================================================================================
    //                                                                           Attribute
    //                                                                           =========

    // ===================================================================================
    //                                                                        Small Helper
    //                                                                        ============
    protected void saveInfo(final VaMessenger<FessMessages> validationMessagesLambda) {
        final FessMessages messages = createMessages();
        validationMessagesLambda.message(messages);
        sessionManager.info().save(messages);
    }

    protected void saveError(final VaMessenger<FessMessages> validationMessagesLambda) {
        final FessMessages messages = createMessages();
        validationMessagesLambda.message(messages);
        sessionManager.errors().save(messages);
    }

    protected void write(final String path, final byte[] data) {
        LdiFileUtil.write(path, data);
    }

    protected void copyBeanToBean(final Object src, final Object dest, final Consumer<CopyOptions> option) {
        BeanUtil.copyBeanToBean(src, dest, option);
    }

    protected ServletContext getServletContext() {
        return LaServletContextUtil.getServletContext();
    }

    // ===================================================================================
    //                                                                            Document
    //                                                                            ========
    /**
     * {@inheritDoc} <br>
     * Application Origin Methods:
     * <pre>
     * <span style="font-size: 130%; color: #553000">[Small Helper]</span>
     * o saveInfo() <span style="color: #3F7E5E">// save messages to session</span>
     * o write() <span style="color: #3F7E5E">// write text to specified file</span>
     * o copyBeanToBean() <span style="color: #3F7E5E">// copy bean to bean by BeanUtil</span>
     * o getServletContext() <span style="color: #3F7E5E">// get servlet context</span>
     * </pre>
     */
    @Override
    public void document1_CallableSuperMethod() {
        super.document1_CallableSuperMethod();
    }

    // ===================================================================================
    //                                                                           User Info
    //                                                                           =========
    @Override
    protected OptionalThing<LoginManager> myLoginManager() {
        return OptionalThing.of(fessLoginAssist);
    }

    // ===================================================================================
    //                                                                            Override
    //                                                                           =========
    @Override
    protected TypicalEmbeddedKeySupplier newTypicalEmbeddedKeySupplier() {
        return new TypicalSimpleEmbeddedKeySupplier() {
            public String getErrorMessageForwardPath() {
                return "/admin/error/error.jsp";
            }
        };
    }
}
