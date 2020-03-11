package org.fh.service.health.familyuser.impl;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.health.familyuser.FamilyUserMapper;
import org.fh.service.health.familyuser.FamilyUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 
 * 说明： 家庭群组人员数据表接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2020-03-12
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class FamilyUserServiceImpl implements FamilyUserService{

	@Autowired
	private FamilyUserMapper familyuserMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		familyuserMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		familyuserMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		familyuserMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return familyuserMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return familyuserMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return familyuserMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		familyuserMapper.deleteAll(ArrayDATA_IDS);
	}
	
}

