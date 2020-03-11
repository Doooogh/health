package org.fh.controller.health.familyuser;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.fh.service.health.family.FamilyService;
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
import org.fh.service.health.familyuser.FamilyUserService;

/** 
 * 说明：家庭群组人员数据表
 * 作者：FH Admin QQ313596790
 * 时间：2020-03-12
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/familyuser")
public class FamilyUserController extends BaseController {
	
	@Autowired
	private FamilyUserService familyuserService;

	@Autowired
	private FamilyService familyService;
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("FAMILYUSER_ID", this.get32UUID());	//主键
		familyuserService.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		familyuserService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		familyuserService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		PageData info = familyService.getInfo(pd);
		List<PageData>	varList = familyuserService.list(page);	//列出FamilyUser列表
		map.put("varList", varList);
		if(Jurisdiction.getUserId().equals(info.getString("CREATE_BY"))){
			map.put("isCreate",true);
		}
		map.put("info",info);
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}
	
	 /**去修改页面获取数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = familyuserService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			familyuserService.deleteAll(ArrayDATA_IDS);
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
		titles.add("family_id");	//1
		titles.add("user_id");	//2
		dataMap.put("titles", titles);
		List<PageData> varOList = familyuserService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("FAMILY_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("USER_ID"));	    //2
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}


	/**
	 * 通过FAMILY_ID加入家庭组
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/joinFamily")
	@ResponseBody
	public Object joinFamily() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("FAMILYUSER_ID",get32UUID());
		pd.put("USER_ID",Jurisdiction.getUserId());
		familyuserService.save(pd);
		map.put("result", errInfo);
		return map;
	}


	/**
	 * 通过FAMILY_ID判断是否已经加入该家庭组
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/hadJoin")
	@ResponseBody
	public Object hadJoin() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if(null==pd.get("USER_ID")||StringUtils.isBlank(pd.getString("USER_ID"))){
			pd.put("USER_ID",Jurisdiction.getUserId());
		}
		List<PageData> list = familyuserService.listAll(pd);
		if(list.size()>0){
			map.put("joinStatusRes",true);
		}else{
			map.put("joinStatusRes",false);
		}
		map.put("result", errInfo);
		return map;
	}

}
