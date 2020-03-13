package org.fh.service.health.healthinfo.impl;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.health.healthinfo.HealthInfoMapper;
import org.fh.service.health.healthinfo.HealthInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 
 * 说明： 健康数据接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2020-03-12
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class HealthInfoServiceImpl implements HealthInfoService{

	@Autowired
	private HealthInfoMapper healthinfoMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		healthinfoMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		healthinfoMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		healthinfoMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return healthinfoMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return healthinfoMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return healthinfoMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		healthinfoMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public List<PageData> getEDataByType(PageData pd) {
		return healthinfoMapper.getEDataByType(pd);
	}

}

