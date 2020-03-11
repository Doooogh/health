package org.fh.service.health.family;

import org.fh.entity.Page;
import org.fh.entity.PageData;

import java.util.List;

/** 
 * 说明： 家人群组管理接口
 * 作者：FH Admin QQ313596790
 * 时间：2020-03-11
 * 官网：www.fhadmin.org
 * @version
 */
public interface FamilyService{

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception;
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception;
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception;
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception;
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception;
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception;

	/**
	 * 根据FAMILY_ID 获取相关信息
	 * @param pd
	 * @return
	 */
	public PageData getInfo(PageData pd);
	
}

