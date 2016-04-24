<jsp:directive.include file="/web20/global/tagLibs.jsp" />
<script type="text/javascript">
	$(function() {
		var isAdClosed = false,
			$ad = $("#scrollingSideAd");
		$(window).scroll(function() {
			!isAdClosed && ($(this).scrollTop() > 80 ? $ad.fadeIn() : $ad.fadeOut());
		});
		$("#scrollingSideAdMap").find("area[alt='close']").click(function() {
			$ad.hide();
			isAdClosed = true;
		});
	});
</script>
<style>
	#globalContentContainer {
		border: none !important;
	}
	
	#scrollingSideAd {
		z-index: 9999;
		position: fixed;
		top: 200px;
		right: 22px;
		display: none;
	}
	
	@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
		#scrollingSideAd {
			display: none !important;
		}
	}
	
	.xtraWideImg {
		max-width: none !important;
		margin-left: -50% !important;
		width: auto !important;
	}
	
	#doc3 {
		overflow-x: hidden !important;
		min-width: 960px;
	}
	
	.block_grid ul,
	.block_grid li {
		margin: 0px !important;
		padding: 0px !important;
	}
</style>
<div id="scrollingSideAd">
	<img id="floatingImage" usemap="#scrollingSideAdMap" border="0" alt="" src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/floater.gif" width="234" height="358"/>
</div>
<map name="scrollingSideAdMap" id="scrollingSideAdMap">
	<area shape="circle" coords="215,14,14" href="javascript:void();" alt="close"/>
</map>
<div class="row collapse" data-row-num="row_01">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_01.png" width="960" height="88" usemap="#20160331_map1" alt=""/>
		<map name="20160331_map1" id="20160331_map1" data-row-num="row_01"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_02">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_02.png" width="960" height="110" usemap="#20160331_map2" alt=""/>
		<map name="20160331_map2" id="20160331_map2" data-row-num="row_02"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_03">
	<div class="small-11 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_03.jpg" width="660" height="505" usemap="#20160331_map3" alt=""/>
		<map name="20160331_map3" id="20160331_map3" data-row-num="row_03"></map>
	</div>
	<div class="small-5 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_04.jpg" width="300" height="505" usemap="#20160331_map4" alt=""/>
		<map name="20160331_map4" id="20160331_map4" data-row-num="row_03"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_04">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_05.gif" width="960" height="90" usemap="#20160331_map5" alt=""/>
		<map name="20160331_map5" id="20160331_map5" data-row-num="row_04"></map>
	</div>
</div>
<div class="row collapse block_grid" data-row-num="row_05">
	<ul class="small-block-grid-3">
		<li>
			<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_06.jpg" width="320" height="251" usemap="#20160331_map6" alt=""/>
			<map name="20160331_map6" id="20160331_map6" data-row-num="row_05"></map>
		</li>
		<li>
			<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_07.jpg" width="320" height="251" usemap="#20160331_map7" alt=""/>
			<map name="20160331_map7" id="20160331_map7" data-row-num="row_05"></map>
		</li>
		<li>
			<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_08.jpg" width="320" height="251" usemap="#20160331_map8" alt=""/>
			<map name="20160331_map8" id="20160331_map8" data-row-num="row_05"></map>
		</li>
	</ul>
</div>
<div class="row collapse block_grid" data-row-num="row_06">
	<ul class="small-block-grid-3">
		<li>
			<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_09.jpg" width="320" height="291" usemap="#20160331_map9" alt=""/>
			<map name="20160331_map9" id="20160331_map9" data-row-num="row_06"></map>
		</li>
		<li>
			<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_10.jpg" width="320" height="291" usemap="#20160331_map10" alt=""/>
			<map name="20160331_map10" id="20160331_map10" data-row-num="row_06"></map>
		</li>
		<li>
			<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_11.jpg" width="320" height="291" usemap="#20160331_map11" alt=""/>
			<map name="20160331_map11" id="20160331_map11" data-row-num="row_06"></map>
		</li>
	</ul>
</div>
<div class="row collapse block_grid" data-row-num="row_07">
	<ul class="small-block-grid-3">
		<li>
			<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_12.jpg" width="320" height="381" usemap="#20160331_map12" alt=""/>
			<map name="20160331_map12" id="20160331_map12" data-row-num="row_07"></map>
		</li>
		<li>
			<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_13.gif" width="320" height="381" usemap="#20160331_map13" alt=""/>
			<map name="20160331_map13" id="20160331_map13" data-row-num="row_07"></map>
		</li>
		<li>
			<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_14.gif" width="320" height="381" usemap="#20160331_map14" alt=""/>
			<map name="20160331_map14" id="20160331_map14" data-row-num="row_07"></map>
		</li>
	</ul>
</div>
<div class="row collapse" data-row-num="row_08">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_15.png" width="960" height="104" usemap="#20160331_map15" alt=""/>
		<map name="20160331_map15" id="20160331_map15" data-row-num="row_08"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_09">
	<div class="small-8 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_16.jpg" width="480" height="545" usemap="#20160331_map16" alt=""/>
		<map name="20160331_map16" id="20160331_map16" data-row-num="row_09"></map>
	</div>
	<div class="small-8 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_17.jpg" width="480" height="545" usemap="#20160331_map17" alt=""/>
		<map name="20160331_map17" id="20160331_map17" data-row-num="row_09"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_10">
	<div class="small-8 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_18.jpg" width="480" height="543" usemap="#20160331_map18" alt=""/>
		<map name="20160331_map18" id="20160331_map18" data-row-num="row_10"></map>
	</div>
	<div class="small-8 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_19.jpg" width="480" height="543" usemap="#20160331_map19" alt=""/>
		<map name="20160331_map19" id="20160331_map19" data-row-num="row_10"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_11">
	<div class="small-8 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_20.jpg" width="480" height="569" usemap="#20160331_map20" alt=""/>
		<map name="20160331_map20" id="20160331_map20" data-row-num="row_11"></map>
	</div>
	<div class="small-8 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_21.jpg" width="480" height="569" usemap="#20160331_map21" alt=""/>
		<map name="20160331_map21" id="20160331_map21" data-row-num="row_11"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_12">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_22.png" width="960" height="34" usemap="#20160331_map22" alt=""/>
		<map name="20160331_map22" id="20160331_map22" data-row-num="row_12"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_13">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_23.jpg" width="960" height="512" usemap="#20160331_map23" alt=""/>
		<map name="20160331_map23" id="20160331_map23" data-row-num="row_13"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_14">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_24.jpg" width="1764" height="487" usemap="#20160331_map24" alt="" class="xtraWideImg"/>
		<map name="20160331_map24" id="20160331_map24" data-row-num="row_14"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_15">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_25.jpg" width="960" height="548" usemap="#20160331_map25" alt=""/>
		<map name="20160331_map25" id="20160331_map25" data-row-num="row_15"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_16">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_26.png" width="960" height="34" usemap="#20160331_map26" alt=""/>
		<map name="20160331_map26" id="20160331_map26" data-row-num="row_16"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_17">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_27.jpg" width="960" height="516" usemap="#20160331_map27" alt=""/>
		<map name="20160331_map27" id="20160331_map27" data-row-num="row_17"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_18">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_28.png" width="960" height="34" usemap="#20160331_map28" alt=""/>
		<map name="20160331_map28" id="20160331_map28" data-row-num="row_18"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_19">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_29.jpg" width="960" height="798" usemap="#20160331_map29" alt=""/>
		<map name="20160331_map29" id="20160331_map29" data-row-num="row_19"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_20">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_30.png" width="960" height="34" usemap="#20160331_map30" alt=""/>
		<map name="20160331_map30" id="20160331_map30" data-row-num="row_20"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_21">
	<div class="small-8 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_31.jpg" width="480" height="374" usemap="#20160331_map31" alt=""/>
		<map name="20160331_map31" id="20160331_map31" data-row-num="row_21"></map>
	</div>
	<div class="small-8 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_32.jpg" width="480" height="373" usemap="#20160331_map32" alt=""/>
		<map name="20160331_map32" id="20160331_map32" data-row-num="row_21"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_22">
	<div class="small-8 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_33.jpg" width="480" height="352" usemap="#20160331_map33" alt=""/>
		<map name="20160331_map33" id="20160331_map33" data-row-num="row_22"></map>
	</div>
	<div class="small-8 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030042_34.jpg" width="480" height="353" usemap="#20160331_map34" alt=""/>
		<map name="20160331_map34" id="20160331_map34" data-row-num="row_22"></map>
	</div>
</div>
<div class="row collapse" data-row-num="row_23">
	<div class="small-16 column">
		<img src="${baseUrlAssets}/dyn_img/homepage/2016/03/31/C6030043_35.jpg" width="960" height="107" usemap="#20160331_map35" alt=""/>
		<map name="20160331_map35" id="20160331_map35" data-row-num="row_23"></map>
	</div>
</div>
<%-- Grunt Task Ran Successfully --%>