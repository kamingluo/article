<?php
// +----------------------------------------------------------------------
// | 后台管理公共方法
// +----------------------------------------------------------------------

use think\Log;
use think\Db;
use think\Request;
use think\Controller;
use think\Config;


    //测试方法
    function test(){
        return "test";
    }


    //微信token获取
    function wxtoken(){
        $dbres =db('wxtoken')->where('id',1)->find();
        $token_time=$dbres["update_time"];
        $time =date('Y-m-d H:i:s',time());//获取当前时间
        $second=floor((strtotime($time)-strtotime($token_time)));//对比两个时间，拿到时间差
        if($second > 3600){
            //一小时更新一次,超过一小时再去调一次
            $data['appid']=Config('appid');
            $data['secret']= Config('secret');
            $data['grant_type']= 'client_credential';
            $api = "https://api.weixin.qq.com/cgi-bin/token";//拿token接口
            $str = http($api, $data,'GET');
            $token = json_decode($str,true);
            $access_token=$token['access_token'];//拿到token
            //更新一下数据库的access_token和时间
            $updatedata= db('wxtoken')->where('id',1)->update(['update_time' => $time,'access_token' => $access_token]);
    }
        else{
            $access_token=$dbres["access_token"];//直接拿到数据库存储的token
        }
    return $access_token;

}