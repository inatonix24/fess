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

package org.codelibs.fess.helper;

import java.util.ArrayList;
import java.util.List;

import org.codelibs.fess.db.exentity.PathMapping;
import org.seasar.extension.unit.S2TestCase;

public class PathMappingHelperTest extends S2TestCase {

    public PathMappingHelper pathMappingHelper;

    @Override
    protected String getRootDicon() throws Throwable {
        return "org/codelibs/fess/helper/pathMapping.dicon";
    }

    public void test_setPathMappingList() {
        final String sessionId = "test";
        final List<PathMapping> pathMappingList = new ArrayList<PathMapping>();

        assertNull(pathMappingHelper.getPathMappingList(sessionId));
        assertNull(pathMappingHelper.getPathMappingList(sessionId + "1"));
        pathMappingHelper.setPathMappingList(sessionId, pathMappingList);
        assertNotNull(pathMappingHelper.getPathMappingList(sessionId));
        assertNull(pathMappingHelper.getPathMappingList(sessionId + "1"));
        pathMappingHelper.removePathMappingList(sessionId);
        assertNull(pathMappingHelper.getPathMappingList(sessionId));
        assertNull(pathMappingHelper.getPathMappingList(sessionId + "1"));

    }

    public void test_replaceUrl() {
        final String sessionId = "test";
        final List<PathMapping> pathMappingList = new ArrayList<PathMapping>();
        final PathMapping pathMapping = new PathMapping();
        pathMapping.setRegex("file:///home/");
        pathMapping.setReplacement("http://localhost/");
        pathMappingList.add(pathMapping);

        pathMappingHelper.setPathMappingList(sessionId, pathMappingList);

        final String url = "file:///home/taro/";
        assertEquals("http://localhost/taro/", pathMappingHelper.replaceUrl(sessionId, url));
    }

    public void test_replaceUrls() {
        final List<PathMapping> pathMappingList = new ArrayList<PathMapping>();
        final PathMapping pathMapping = new PathMapping();
        pathMapping.setRegex("file:///home/");
        pathMapping.setReplacement("http://localhost/");
        pathMappingList.add(pathMapping);

        pathMappingHelper.cachedPathMappingList = pathMappingList;

        String text = "\"file:///home/\"";
        assertEquals("\"http://localhost/\"", pathMappingHelper.replaceUrls(text));

        text = "\"file:///home/taro/\"";
        assertEquals("\"http://localhost/taro/\"", pathMappingHelper.replaceUrls(text));

        text = "\"aaafile:///home/taro/\"";
        assertEquals("\"aaahttp://localhost/taro/\"", pathMappingHelper.replaceUrls(text));

        text = "aaa\"file:///home/taro/\"bbb";
        assertEquals("aaa\"http://localhost/taro/\"bbb", pathMappingHelper.replaceUrls(text));

    }
}
