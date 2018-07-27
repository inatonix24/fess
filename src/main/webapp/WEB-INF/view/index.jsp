<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head profile="http://a9.com/-/spec/opensearch/1.1/">
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-120970429-1"></script>
<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	if( localStorage['exceptme']!='1'){
		gtag('js', new Date());
		gtag('config', 'UA-120970429-1');
	}
</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title><la:message key="labels.search_title" /></title>
<c:if test="${osddLink}">
	<link rel="search" type="application/opensearchdescription+xml"
		href="${fe:url('/osdd')}"
		title="<la:message key="labels.index_osdd_title" />" />
</c:if>
<link href="${fe:url('/css/style-base.css')}" rel="stylesheet"
	type="text/css" />
<link href="${fe:url('/css/style.css')}" rel="stylesheet" type="text/css" />
<link href="${fe:url('/css/font-awesome.min.css')}" rel="stylesheet"
type="text/css" />
<link href="${fe:url('/css/magic.min.css')}" rel="stylesheet" type="text/css" />
<link href='https://fonts.googleapis.com/css?family=Cabin+Condensed:700' rel='stylesheet' type='text/css'>
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0" />
<style>
	body {
		margin: 0;
		height: 0;
		overflow: hidden;
		background: white;
	}
</style>
</head>
<body onload="init();">
	<la:form styleClass="form-stacked" action="search" method="get"
		styleId="searchForm">
		${fe:facetForm()}${fe:geoForm()}
		<nav class="navbar navbar-dark bg-inverse navbar-static-top pos-f-t">
			<div id="content" class="container" style="text-align: center">
				<span id="nekocount">0</span>
				<ul class="nav navbar-nav pull-right">
					<c:choose>
						<c:when test="${!empty username && username != 'guest'}">
							<li class="nav-item">
								<div class="dropdown">
									<a class="nav-link dropdown-toggle" data-toggle="dropdown"
										href="#" role="button" aria-haspopup="true"
										aria-expanded="false"> <i class="fa fa-user"></i>${username}
									</a>
									<div class="dropdown-menu" aria-labelledby="userMenu">
										<c:if test="${editableUser == true}">
											<la:link href="/profile" styleClass="dropdown-item">
												<la:message key="labels.profile" />
											</la:link>
										</c:if>
										<c:if test="${adminUser == true}">
											<la:link href="/admin" styleClass="dropdown-item">
												<la:message key="labels.administration" />
											</la:link>
										</c:if>
										<la:link href="/logout/" styleClass="dropdown-item">
											<la:message key="labels.logout" />
										</la:link>
									</div>
								</div>
							</li>
						</c:when>
						<c:when test="${ pageLoginLink }">
							<!-- <li class="nav-item username"><la:link href="/login"
									styleClass="nav-link" role="button" aria-haspopup="true"
									aria-expanded="false">
									<i class="fa fa-sign-in"></i>
									<la:message key="labels.login" />
								</la:link></li> -->
						</c:when>
					</c:choose>
					<!-- <li class="nav-item"><la:link href="/help"
							styleClass="nav-link help-link">
							<i class="fa fa-question-circle"></i>
							<la:message key="labels.index_help" />
						</la:link></li> -->
				</ul>
			</div>
		</nav>
		<div class="wrapdiv">
			<div id="canvasdiv">
				<canvas id="canvas" class="noselect"></canvas>
			</div>
			<div class="container">
				<div class="row content">
					<div class="center-block searchFormBox">
						<h1 class="mainLogo noselect">
							<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
								width="1000px" height="240px" xml:space="preserve">
							 <defs>
							   <pattern id="water" width=".25" height="1.1" patternContentUnits="objectBoundingBox">
								 <path fill="green" d="M0.25,1H0c0,0,0-0.659,0-0.916c0.083-0.303,0.158,0.334,0.25,0C0.25,0.327,0.25,1,0.25,1z"/>
							   </pattern>
							   
							   <pattern id="water2" width=".25" height="1.1" patternContentUnits="objectBoundingBox">
									   <path fill="#65C580" d="M0.25,1H0c0,0,0-0.659,0-0.916c0.083-0.303,0.158,0.334,0.25,0C0.25,0.327,0.25,1,0.25,1z"/>
							   </pattern>
				   
							   <text id="text" transform="translate(2,116)" font-family="'Cabin Condensed'" font-size="84">PCL Manual Search</text>
							   
							   <mask id="text-mask">
								 <use x="0" y="0" xlink:href="#text" opacity="1" fill="#ffff"/>
							   </mask>
							   
							   <g id="eff">
								 <use x="0" y="0" xlink:href="#text" fill="#a2a3a5"/>
								   <rect class="water-fill" mask="url(#text-mask)" fill="url(#water2)" x="-300" y="40" width="1200" height="120" opacity="0.3">
									   <animate attributeType="xml" attributeName="x" from="-300" to="0" repeatCount="indefinite" dur="2.4s"/>
								   </rect>
								   <rect class="water-fill" mask="url(#text-mask)" fill="url(#water2)" y="60" width="1600" height="120" opacity="0.3">
									   <animate attributeType="xml" attributeName="x" from="-400" to="0" repeatCount="indefinite" dur="5s"/>
								   </rect>
									   
								   <rect class="water-fill" mask="url(#text-mask)" fill="url(#water)" y="70" width="800" height="120" opacity="0.3">
									   <animate attributeType="xml" attributeName="x" from="-200" to="0" repeatCount="indefinite" dur="3s"/>
								   </rect>
									   <rect class="water-fill" mask="url(#text-mask)" fill="url(#water)" y="80" width="2000" height="120" opacity="0.3">
									   <animate attributeType="xml" attributeName="x" from="-500" to="0" repeatCount="indefinite" dur="6s"/>
								   </rect>
							   </g>
							 </defs>
							
								 <use xlink:href="#eff" opacity="0.9" style="mix-blend-mode:color-burn"/>
						   
						   </svg>



						</h1>
						<div class="notification">${notification}</div>
						<div>
							<la:info id="msg" message="true">
								<div class="alert alert-info">${msg}</div>
							</la:info>
							<la:errors header="errors.front_header"
								footer="errors.front_footer" prefix="errors.front_prefix"
								suffix="errors.front_suffix" />
						</div>
						<fieldset>
							<div class="clearfix">
								<div class="centered col-lg-5 col-md-6 col-sm-6 col-xs-8">
									<la:text styleClass="query form-control center-block"
										property="q" size="50" maxlength="1000" styleId="contentQuery"
										autocomplete="off" />
								</div>
							</div>
							<c:if test="${!empty popularWords}">
								<div class="clearfix">
									<p class="popularWordBody ellipsis">
										<la:message key="labels.search_popular_word_word" />
										<c:forEach var="item" varStatus="s" items="${popularWords}">
											<c:if test="${s.index < 3}">
												<la:link
													href="/search?q=${f:u(item)}${fe:facetQuery()}${fe:geoQuery()}">${f:h(item)}</la:link>
											</c:if>
											<c:if test="${3 <= s.index}">
												<la:link styleClass="hidden-xs"
													href="/search?q=${f:u(item)}${fe:facetQuery()}${fe:geoQuery()}">${f:h(item)}</la:link>
											</c:if>
										</c:forEach>
									</p>
								</div>
							</c:if>
							<div class="clearfix searchButtonBox btn-group">
								<button type="submit" name="search" id="searchButton"
									class="btn btn-primary">
									<i class="fa fa-search"></i>
									<la:message key="labels.index_form_search_btn" />
								</button>
								<button type="button" class="btn btn-secondary"
									data-toggle="control-options" data-target="#searchOptions"
									id="searchOptionsButton">
									<i class="fa fa-cog"></i>
									<la:message key="labels.index_form_option_btn" />
								</button>
							</div>
						</fieldset>
					</div>
				</div>
			</div>
		</div>
		<jsp:include page="footer.jsp" />
		<div id="searchOptions" class="control-options">
			<div class="container">
				<jsp:include page="searchOptions.jsp" />
				<div>
					<button type="button" class="btn btn-secondary" id="searchOptionsClearButton">
						<la:message key="labels.search_options_clear" />
					</button>
					<button type="button" class="btn btn-secondary pull-right"
						data-toggle="control-options" data-target="#searchOptions"
						id="searchOptionsCloseButton">
						<i class="fa fa-times-circle"></i>
						<la:message key="labels.search_options_close" />
					</button>
				</div>
			</div>
		</div>
	</la:form>
	<input type="hidden" id="contextPath" value="${contextPath}" />
	<script type="text/javascript"
		src="${fe:url('/js/jquery-2.2.4.min.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/bootstrap.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/suggestor.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/index.js')}"></script>
	<script type="text/javascript" src="${fe:url('/js/createjs-2013.02.12.min.js')}"></script>
	<script type="text/javascript" src="${f:url('/js/box2dweb.js')}"></script>
	<script type="text/javascript" src="${f:url('/js/aws-sdk-2.280.1.min.js')}"></script>
	<script type="text/javascript" src="${f:url('/js/neko.js')}"></script>
</body>
</html>
