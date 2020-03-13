package org.fh.controller.health.basicinfo;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.fh.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.apache.shiro.authz.annotation.RequiresPermissions;

import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.health.basicinfo.BasicInfoService;

/** 
 * 说明：用户基本信息
 * 作者：FH Admin QQ313596790
 * 时间：2020-03-10
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/basicinfo")
public class BasicInfoController extends BaseController {
	
	@Autowired
	private BasicInfoService basicinfoService;
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("basicinfo:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("BASICINFO_ID", this.get32UUID());	//主键
		pd.put("CREATE_BY",Jurisdiction.getUserId());	//主键
		pd.put("CREATE_DATE",new Date());
		pd.put("IS_NEW","1");
		basicinfoService.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("basicinfo:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		basicinfoService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("basicinfo:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		basicinfoService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("basicinfo:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		if(!Jurisdiction.getRnumbers().contains(Const.ROLE_IDS_ADMIN_RNUMBER)){
			pd.put("CREATE_BY",Jurisdiction.getUserId());
		}
		page.setPd(pd);
		List<PageData>	varList = basicinfoService.list(page);	//列出BasicInfo列表
		map.put("varList", varList);
		if(Jurisdiction.getRnumbers().contains(Const.ROLE_IDS_ADMIN_RNUMBER)){
			map.put("isAdmin",true);
		}
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}
	
	 /**去修改页面获取数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@RequiresPermissions("basicinfo:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = basicinfoService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}

	/**根据user_id 获取个人的基本信息
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/getPInfo")
	@RequiresPermissions("basicinfo:edit")
	@ResponseBody
	public Object getPInfo() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if(null==pd.get("USER_ID")||StringUtils.isBlank(pd.getString("USER_ID"))){
			errInfo="error";
			throw new Exception("没有指定用户");
		}else{
			pd = basicinfoService.findByUserIdNew(pd);	//根据ID读取
			map.put("pd", pd);
		}
		map.put("result", errInfo);
		return map;
	}

	/**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("basicinfo:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			basicinfoService.deleteAll(ArrayDATA_IDS);
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
		titles.add("姓名");	//1
		titles.add("性别");	//2
		titles.add("生日");	//3
		titles.add("身高");	//4
		titles.add("体重");	//5
		titles.add("过敏史");	//6
		titles.add("疾病史");	//7
		titles.add("家族病史");	//8
		titles.add("其他信息");	//9
		titles.add("用户id");	//10
		dataMap.put("titles", titles);
		List<PageData> varOList = basicinfoService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("NAME"));	    //1
			vpd.put("var2", varOList.get(i).getString("SEX"));	    //2
			vpd.put("var3", varOList.get(i).getString("BIRTHDAY"));	    //3
			vpd.put("var4", varOList.get(i).getString("HEIGHT"));	    //4
			vpd.put("var5", varOList.get(i).getString("WEIGHT"));	    //5
			vpd.put("var6", varOList.get(i).getString("ALLERGIC_HISTORY"));	    //6
			vpd.put("var7", varOList.get(i).getString("DISEASES_HISTORY"));	    //7
			vpd.put("var8", varOList.get(i).getString("FA_DISEASES_HISTORY"));	    //8
			vpd.put("var9", varOList.get(i).getString("OTHERS"));	    //9
			vpd.put("var10", varOList.get(i).getString("USER_ID"));	    //10
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
}
