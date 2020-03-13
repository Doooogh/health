package org.fh.controller.health.healthinfo;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.fh.config.HealthInfoEnum;
import org.fh.util.Jurisdiction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.apache.shiro.authz.annotation.RequiresPermissions;

import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.util.DateUtil;
import org.fh.util.ObjectExcelView;
import org.fh.util.Tools;
import org.fh.entity.PageData;
import org.fh.service.health.healthinfo.HealthInfoService;

/** 
 * 说明：健康数据
 * 作者：FH Admin QQ313596790
 * 时间：2020-03-12
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/healthinfo")
public class HealthInfoController extends BaseController {
	
	@Autowired
	private HealthInfoService healthinfoService;
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("healthinfo:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("HEALTHINFO_ID", this.get32UUID());	//主键
		if(null==pd.get("USER_ID")||StringUtils.isBlank(pd.getString("USER_ID"))){
			pd.put("USER_ID",Jurisdiction.getUserId());
		}
		pd.put("CREATE_BY",Jurisdiction.getUserId());
		pd.put("CREATE_DATE",new Date());
		healthinfoService.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("healthinfo:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		healthinfoService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("healthinfo:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("CREATE_BY",Jurisdiction.getUserId());
		healthinfoService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("healthinfo:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = healthinfoService.list(page);	//列出HealthInfo列表
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}
	
	 /**去修改页面获取数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@RequiresPermissions("healthinfo:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = healthinfoService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("healthinfo:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			healthinfoService.deleteAll(ArrayDATA_IDS);
			errInfo = "success";
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	 /**导出到excel
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/excel")
	@RequiresPermissions("toExcel")
	public ModelAndView exportExcel() throws Exception{
		ModelAndView mv = new ModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		Map<String,Object> dataMap = new HashMap<String,Object>();
		List<String> titles = new ArrayList<String>();
		titles.add("信息归属人");	//1
		titles.add("创建人");	//2
		titles.add("创建时间");	//3
		titles.add("步数");	//4
		titles.add("心率");	//5
		titles.add("体重");	//6
		titles.add("血压");	//7
		titles.add("睡眠时长");	//8
		titles.add("其他信息");	//9
		dataMap.put("titles", titles);
		List<PageData> varOList = healthinfoService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("USER_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("CREATE_BY"));	    //2
			vpd.put("var3", varOList.get(i).getString("CREATE_DATE"));	    //3
			vpd.put("var4", varOList.get(i).getString("STEP_NUMBER"));	    //4
			vpd.put("var5", varOList.get(i).getString("HEART_RATE"));	    //5
			vpd.put("var6", varOList.get(i).getString("WEIGHT"));	    //6
			vpd.put("var7", varOList.get(i).getString("BLOOD_PRESSURE"));	    //7
			vpd.put("var8", varOList.get(i).getString("SLEEP_TIME"));	    //8
			vpd.put("var9", varOList.get(i).getString("OTHER_INFO"));	    //9
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}

	@RequestMapping("/dataAnalysisECharts")
	@ResponseBody
	public Object dataAnalysisECharts(){
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String COLUMN=pd.getString("COLUMN");   //数据分析类型  比如心率 步数
		Map<String,Object> dMap=new HashMap<>();
		if("HEART_RATE".equals(COLUMN)){
			dMap.put("DATA_TYPE",HealthInfoEnum.HEART_RATE.getDataType());
			dMap.put("NAME",HealthInfoEnum.HEART_RATE.getName());
			dMap.put("UNIT",HealthInfoEnum.HEART_RATE.getUnit());
		}else if("STEP_NUMBER".equals(COLUMN)){
			dMap.put("DATA_TYPE",HealthInfoEnum.STEP_NUMBER.getDataType());
			dMap.put("NAME",HealthInfoEnum.STEP_NUMBER.getName());
			dMap.put("UNIT",HealthInfoEnum.STEP_NUMBER.getUnit());
		}else if("WEIGHT".equals(COLUMN)){
			dMap.put("DATA_TYPE",HealthInfoEnum.WEIGHT.getDataType());
			dMap.put("NAME",HealthInfoEnum.WEIGHT.getName());
			dMap.put("UNIT",HealthInfoEnum.WEIGHT.getUnit());
		}else if("SLEEP_TIME".equals(COLUMN)){
			dMap.put("DATA_TYPE",HealthInfoEnum.SLEEP_TIME.getDataType());
			dMap.put("NAME",HealthInfoEnum.SLEEP_TIME.getName());
			dMap.put("UNIT",HealthInfoEnum.SLEEP_TIME.getUnit());
		}else if("BLOOD_PRESSURE".equals(COLUMN)){
			dMap.put("DATA_TYPE",HealthInfoEnum.BLOOD_PRESSURE.getDataType());
			dMap.put("NAME",HealthInfoEnum.BLOOD_PRESSURE.getName());
			dMap.put("UNIT",HealthInfoEnum.BLOOD_PRESSURE.getUnit());
		}else{
			errInfo="error";
		}
		map.put("dMap",dMap);
		List<PageData> eDataByType = healthinfoService.getEDataByType(pd);
		List<String> timeList=new ArrayList<>();
		List<String> dataList=new ArrayList<>();
		for (PageData pageData : eDataByType) {
			timeList.add(pageData.getString("ETIME"));
			dataList.add(pageData.getString("EDATA"));
		}
		dMap.put("eData",dataList);
		dMap.put("eTime",timeList);
		map.put("aData",dMap);
		map.put("result",errInfo);
		return map;
	}


	
}
